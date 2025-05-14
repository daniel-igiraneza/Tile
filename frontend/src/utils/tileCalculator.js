/**
 * Calculate tile layout and quantities
 * @param {number} roomLength - Room length in meters
 * @param {number} roomWidth - Room width in meters
 * @param {number} tileLength - Tile length in centimeters
 * @param {number} tileWidth - Tile width in centimeters
 * @param {number} spacing - Spacing between tiles in millimeters
 * @param {string} pattern - Tile pattern (grid, brick, herringbone, diagonal)
 * @returns {object} Calculation results
 */
const calculateTiles = (roomLength, roomWidth, tileLength, tileWidth, spacing, pattern = "grid") => {
  // Convert all measurements to meters for consistency
  const tileLengthM = tileLength / 100 // Convert cm to m
  const tileWidthM = tileWidth / 100 // Convert cm to m
  const spacingM = spacing / 1000 // Convert mm to m

  // Calculate room area
  const roomArea = roomLength * roomWidth

  // Calculate effective tile area (including spacing)
  const effectiveTileLengthM = tileLengthM + spacingM
  const effectiveTileWidthM = tileWidthM + spacingM
  const tileAreaWithSpacing = effectiveTileLengthM * effectiveTileWidthM

  // Calculate actual tile area (without spacing)
  const actualTileArea = tileLengthM * tileWidthM

  // Calculate number of tiles needed based on pattern
  let tilesNeeded, tilesAlongLength, tilesAlongWidth, wholeTiles, cutTiles, edgeTiles, cornerTiles
  let patternWasteFactor = 1.0 // Default waste factor for grid pattern
  let savedTiles = 0

  switch (pattern) {
    case "brick":
      // Brick pattern calculations (tiles offset by half)
      patternWasteFactor = 1.05 // 5% more tiles due to pattern
      tilesAlongLength = Math.ceil(roomLength / effectiveTileLengthM)
      tilesAlongWidth = Math.ceil(roomWidth / effectiveTileWidthM)

      // In brick pattern, we need to account for the offset
      const brickRows = tilesAlongWidth
      const tilesPerRow = tilesAlongLength + (brickRows % 2 === 0 ? 0 : 0.5)
      tilesNeeded = Math.ceil(tilesPerRow * brickRows)

      // In brick pattern, we have more cut tiles along the edges
      wholeTiles = Math.floor((tilesAlongLength - 1) * (tilesAlongWidth - 1))
      edgeTiles = tilesAlongLength * 2 + tilesAlongWidth * 2 - 4
      cornerTiles = 4
      cutTiles = tilesNeeded - wholeTiles
      break

    case "herringbone":
      // Herringbone pattern (tiles at 45 degrees)
      // This is a more complex pattern with more waste
      patternWasteFactor = 1.15 // 15% more tiles due to pattern

      // For herringbone, we calculate based on the diagonal dimension of tiles
      const effectiveTileSize = Math.sqrt(Math.pow(tileLengthM, 2) + Math.pow(tileWidthM, 2))
      tilesAlongLength = Math.ceil(roomLength / (effectiveTileSize * 0.7 + spacingM))
      tilesAlongWidth = Math.ceil(roomWidth / (effectiveTileSize * 0.7 + spacingM))

      // Herringbone uses pairs of tiles
      const herringbonePairs = Math.ceil((tilesAlongLength * tilesAlongWidth) / 2)
      tilesNeeded = herringbonePairs * 2

      // Herringbone has more cut tiles
      wholeTiles = Math.floor(tilesNeeded * 0.7)
      cutTiles = tilesNeeded - wholeTiles
      edgeTiles = Math.ceil((2 * (roomLength + roomWidth)) / (tileLengthM + tileWidthM) / 2)
      cornerTiles = 4
      break

    case "diagonal":
      // Diagonal pattern (tiles at 45 degrees)
      patternWasteFactor = 1.1 // 10% more tiles due to pattern

      // For diagonal pattern, we need to account for the 45-degree rotation
      tilesAlongLength = Math.ceil(roomLength / (tileLengthM * 0.7 + spacingM))
      tilesAlongWidth = Math.ceil(roomWidth / (tileWidthM * 0.7 + spacingM))
      tilesNeeded = Math.ceil(tilesAlongLength * tilesAlongWidth * patternWasteFactor)

      // Diagonal has more cut tiles along the edges
      wholeTiles = Math.floor(tilesNeeded * 0.75)
      cutTiles = tilesNeeded - wholeTiles
      edgeTiles = Math.ceil((2 * (roomLength + roomWidth)) / (tileLengthM + tileWidthM) / 2)
      cornerTiles = 4
      break

    case "grid":
    default:
      // Standard grid pattern
      tilesAlongLength = Math.ceil(roomLength / effectiveTileLengthM)
      tilesAlongWidth = Math.ceil(roomWidth / effectiveTileWidthM)

      // Calculate the exact number of tiles needed
      const exactTilesNeeded = roomArea / actualTileArea
      tilesNeeded = tilesAlongLength * tilesAlongWidth

      // Calculate number of whole tiles
      wholeTiles = Math.floor(tilesAlongLength) * Math.floor(tilesAlongWidth)

      // Calculate number of cut tiles
      cutTiles = tilesNeeded - wholeTiles

      // Calculate edge tiles (tiles that need to be cut along the edges)
      edgeTiles = tilesAlongLength * 2 + tilesAlongWidth * 2 - 4

      // Calculate corner tiles (tiles that need to be cut at the corners)
      cornerTiles = 4

      // Calculate how many tiles are saved compared to just dividing the area
      savedTiles = Math.max(0, Math.round(exactTilesNeeded - tilesNeeded))
      break
  }

  // Calculate total area of tiles needed (in square meters)
  const totalTileArea = tilesNeeded * actualTileArea

  // Calculate waste percentage (typically 10% extra for cuts and errors)
  const wastePercentage = 10
  const totalTilesWithWaste = Math.ceil(tilesNeeded * (1 + wastePercentage / 100))

  // Calculate cost estimates (assuming average cost per tile)
  const averageTileCost = 5 // $5 per tile as a default
  const estimatedCost = totalTilesWithWaste * averageTileCost

  // Calculate installation time estimate (assuming 10 tiles per hour)
  const installationHours = Math.ceil(totalTilesWithWaste / 10)

  return {
    roomArea: Number.parseFloat(roomArea.toFixed(2)),
    tilesNeeded: Math.ceil(tilesNeeded),
    wholeTiles: Math.ceil(wholeTiles),
    cutTiles: Math.ceil(cutTiles),
    edgeTiles: Math.ceil(edgeTiles),
    cornerTiles: Math.ceil(cornerTiles),
    totalTileArea: Number.parseFloat(totalTileArea.toFixed(2)),
    totalTilesWithWaste: Math.ceil(totalTilesWithWaste),
    tilesAlongLength: Math.ceil(tilesAlongLength),
    tilesAlongWidth: Math.ceil(tilesAlongWidth),
    savedTiles: savedTiles,
    patternWasteFactor: patternWasteFactor,
    estimatedCost: Number.parseFloat(estimatedCost.toFixed(2)),
    installationHours: installationHours,
    calculationExplanation: generateExplanation(
      roomLength,
      roomWidth,
      tileLength,
      tileWidth,
      spacing,
      pattern,
      tilesNeeded,
      wholeTiles,
      cutTiles,
    ),
  }
}

/**
 * Generate a human-readable explanation of the calculation
 */
const generateExplanation = (
  roomLength,
  roomWidth,
  tileLength,
  tileWidth,
  spacing,
  pattern,
  tilesNeeded,
  wholeTiles,
  cutTiles,
) => {
  const roomArea = roomLength * roomWidth
  const tileLengthM = tileLength / 100
  const tileWidthM = tileWidth / 100
  const spacingM = spacing / 1000

  let explanation = `
## Tile Calculation Explanation

### Room Dimensions
- Room Length: ${roomLength} meters
- Room Width: ${roomWidth} meters
- Total Room Area: ${roomArea.toFixed(2)} square meters

### Tile Specifications
- Tile Size: ${tileLength} cm × ${tileWidth} cm (${tileLengthM} m × ${tileWidthM} m)
- Spacing Between Tiles: ${spacing} mm (${spacingM} m)
- Tile Pattern: ${pattern.charAt(0).toUpperCase() + pattern.slice(1)}

### Calculation Method
`

  switch (pattern) {
    case "brick":
      explanation += `
For a brick pattern, tiles are laid with each row offset by half a tile. This creates a more complex edge pattern.

1. First, we calculate how many tiles fit along the length and width:
   - Tiles along length: ${roomLength} ÷ (${tileLengthM} + ${spacingM}) = ${Math.ceil(roomLength / (tileLengthM + spacingM))} tiles
   - Tiles along width: ${roomWidth} ÷ (${tileWidthM} + ${spacingM}) = ${Math.ceil(roomWidth / (tileWidthM + spacingM))} tiles

2. Due to the brick pattern offset, we need to account for additional tiles at the edges.

3. Total tiles needed: ${tilesNeeded} tiles
   - Whole tiles: ${wholeTiles} tiles
   - Cut tiles: ${cutTiles} tiles
`
      break

    case "herringbone":
      explanation += `
For a herringbone pattern, tiles are laid at 45-degree angles in an interlocking pattern. This creates more waste but a visually striking design.

1. For herringbone patterns, we calculate based on the diagonal dimension of tiles:
   - Effective tile size: √(${tileLengthM}² + ${tileWidthM}²) = ${Math.sqrt(Math.pow(tileLengthM, 2) + Math.pow(tileWidthM, 2)).toFixed(2)} m

2. Herringbone patterns require approximately 15% more tiles due to the complex cutting pattern.

3. Total tiles needed: ${tilesNeeded} tiles
   - Whole tiles: ${wholeTiles} tiles
   - Cut tiles: ${cutTiles} tiles
`
      break

    case "diagonal":
      explanation += `
For a diagonal pattern, tiles are laid at a 45-degree angle to the room. This creates more waste at the edges.

1. For diagonal patterns, we need to account for the 45-degree rotation:
   - Tiles along length: ${Math.ceil(roomLength / (tileLengthM * 0.7 + spacingM))} tiles
   - Tiles along width: ${Math.ceil(roomWidth / (tileWidthM * 0.7 + spacingM))} tiles

2. Diagonal patterns require approximately 10% more tiles due to the edge cutting.

3. Total tiles needed: ${tilesNeeded} tiles
   - Whole tiles: ${wholeTiles} tiles
   - Cut tiles: ${cutTiles} tiles
`
      break

    case "grid":
    default:
      explanation += `
For a standard grid pattern, tiles are laid in straight rows and columns.

1. First, we calculate how many tiles fit along the length and width:
   - Tiles along length: ${roomLength} ÷ (${tileLengthM} + ${spacingM}) = ${Math.ceil(roomLength / (tileLengthM + spacingM))} tiles
   - Tiles along width: ${roomWidth} ÷ (${tileWidthM} + ${spacingM}) = ${Math.ceil(roomWidth / (tileWidthM + spacingM))} tiles

2. Then we multiply to get the total number of tiles:
   - ${Math.ceil(roomLength / (tileLengthM + spacingM))} × ${Math.ceil(roomWidth / (tileWidthM + spacingM))} = ${tilesNeeded} tiles

3. We identify whole tiles and cut tiles:
   - Whole tiles: ${wholeTiles} tiles
   - Cut tiles: ${cutTiles} tiles
`
      break
  }

  explanation += `
### Recommendations
1. Purchase at least 10% extra tiles to account for cuts, breakage, and future repairs.
2. For complex patterns like ${pattern}, consider having a professional installer.
3. Make sure to account for doorways and other features in your final layout.
`

  return explanation
}

module.exports = { calculateTiles }
