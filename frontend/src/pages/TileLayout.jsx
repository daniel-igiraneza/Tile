"use client"

import  Select  from "../components/common/Select"

import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import styled from "styled-components"
import axios from "axios"
import Layout from "../components/layout/Layout"
import Card from "../components/common/Card"
import Button from "../components/common/Button"
import Loader from "../components/common/Loader"

const LayoutContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`

const PageTitle = styled.h1`
  font-size: 2rem;
`

const LayoutControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
`

const CanvasContainer = styled.div`
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  box-shadow: ${(props) => props.theme.shadows.small};
  overflow: hidden;
  margin-bottom: 2rem;
`

const Canvas = styled.canvas`
  width: 100%;
  height: auto;
  display: block;
`

const DetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: ${(props) => props.theme.breakpoints.tablet}) {
    grid-template-columns: 2fr 1fr;
  }
`

const DetailsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`

const DetailItem = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  padding: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
`

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: ${(props) => props.theme.colors.lightText};
  margin-bottom: 0.25rem;
`

const DetailValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
`

const LegendContainer = styled.div`
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: ${(props) => props.theme.borderRadius.medium};
`

const LegendTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
`

const LegendColor = styled.div`
  width: 20px;
  height: 20px;
  margin-right: 0.75rem;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  border: ${(props) => (props.border ? `1px solid ${props.border}` : "none")};
`

const LegendText = styled.div`
  font-size: 0.9rem;
`

const ExplanationContainer = styled.div`
  margin-top: 2rem;
  background-color: white;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  padding: 1.5rem;
  box-shadow: ${(props) => props.theme.shadows.small};
`

const ExplanationTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${(props) => props.theme.colors.primary};
`

const ExplanationContent = styled.div`
  font-size: 0.95rem;
  line-height: 1.6;
  
  h2, h3 {
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
    color: ${(props) => props.theme.colors.primary};
  }
  
  ul, ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  p {
    margin-bottom: 1rem;
  }
`

const SuccessMessage = styled.div`
  background-color: ${(props) => props.theme.colors.success}20;
  color: ${(props) => props.theme.colors.success};
  padding: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  margin-bottom: 1.5rem;
`

const ErrorMessage = styled.div`
  background-color: ${(props) => props.theme.colors.error}20;
  color: ${(props) => props.theme.colors.error};
  padding: 1rem;
  border-radius: ${(props) => props.theme.borderRadius.medium};
  margin-bottom: 1.5rem;
`

const TileLayout = () => {
  const { calculationId } = useParams()
  const [calculation, setCalculation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [pdfUrl, setPdfUrl] = useState("")
  const canvasRef = useRef(null)

  useEffect(() => {
    const fetchCalculation = async () => {
      try {
        // Fetch calculation from the database
        const response = await axios.get(`/api/calculations/${calculationId}`)
        setCalculation(response.data)

        // If there's already a report path, set it
        if (response.data.reportPath) {
          setPdfUrl(response.data.reportPath)
        }
      } catch (error) {
        console.error("Error fetching calculation:", error)
        setErrorMessage("Failed to load calculation data. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchCalculation()
  }, [calculationId])

  useEffect(() => {
    if (calculation && canvasRef.current) {
      drawTileLayout()
    }
  }, [calculation])

  const drawTileLayout = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!calculation) return

    // Set canvas dimensions based on room dimensions
    // We'll scale the room to fit the canvas while maintaining aspect ratio
    const roomLength = calculation.roomLength
    const roomWidth = calculation.roomWidth
    const aspectRatio = roomLength / roomWidth

    // Set canvas size
    const maxWidth = 800
    const maxHeight = 600

    let canvasWidth, canvasHeight

    if (aspectRatio > maxWidth / maxHeight) {
      canvasWidth = maxWidth
      canvasHeight = maxWidth / aspectRatio
    } else {
      canvasHeight = maxHeight
      canvasWidth = maxHeight * aspectRatio
    }

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Calculate tile dimensions in canvas units
    const tileLength = (calculation.tileLength / 100) * (canvasWidth / roomLength)
    const tileWidth = (calculation.tileWidth / 100) * (canvasHeight / roomWidth)
    const spacing = (calculation.spacing / 1000) * (canvasWidth / roomLength)

    // Draw room background
    ctx.fillStyle = "#f5f5f5"
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Draw tiles
    const tilesAlongLength = calculation.results.tilesAlongLength
    const tilesAlongWidth = calculation.results.tilesAlongWidth

    // Draw tiles based on pattern
    switch (calculation.pattern) {
      case "brick":
        drawBrickPattern(
          ctx,
          tilesAlongLength,
          tilesAlongWidth,
          tileLength,
          tileWidth,
          spacing,
          canvasWidth,
          canvasHeight,
        )
        break
      case "herringbone":
        drawHerringbonePattern(
          ctx,
          tilesAlongLength,
          tilesAlongWidth,
          tileLength,
          tileWidth,
          spacing,
          canvasWidth,
          canvasHeight,
        )
        break
      case "diagonal":
        drawDiagonalPattern(
          ctx,
          tilesAlongLength,
          tilesAlongWidth,
          tileLength,
          tileWidth,
          spacing,
          canvasWidth,
          canvasHeight,
        )
        break
      case "grid":
      default:
        drawGridPattern(
          ctx,
          tilesAlongLength,
          tilesAlongWidth,
          tileLength,
          tileWidth,
          spacing,
          canvasWidth,
          canvasHeight,
        )
        break
    }

    // Draw room border
    ctx.strokeStyle = "#333333"
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, canvasWidth, canvasHeight)
  }

  const drawGridPattern = (
    ctx,
    tilesAlongLength,
    tilesAlongWidth,
    tileLength,
    tileWidth,
    spacing,
    canvasWidth,
    canvasHeight,
  ) => {
    for (let i = 0; i < tilesAlongLength; i++) {
      for (let j = 0; j < tilesAlongWidth; j++) {
        const x = i * (tileLength + spacing)
        const y = j * (tileWidth + spacing)

        // Determine if this is an edge or corner tile
        const isLeftEdge = i === 0
        const isRightEdge = i === tilesAlongLength - 1
        const isTopEdge = j === 0
        const isBottomEdge = j === tilesAlongWidth - 1

        const isCorner =
          (isLeftEdge && isTopEdge) ||
          (isLeftEdge && isBottomEdge) ||
          (isRightEdge && isTopEdge) ||
          (isRightEdge && isBottomEdge)

        const isEdge = isLeftEdge || isRightEdge || isTopEdge || isBottomEdge

        // Set tile color based on type
        if (isCorner) {
          ctx.fillStyle = "#ffcccc" // Light red for corner tiles
        } else if (isEdge) {
          ctx.fillStyle = "#ffffcc" // Light yellow for edge tiles
        } else {
          ctx.fillStyle = "#ffffff" // White for whole tiles
        }

        // Draw tile
        ctx.fillRect(x, y, tileLength, tileWidth)

        // Draw tile border
        ctx.strokeStyle = "#cccccc"
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, tileLength, tileWidth)
      }
    }
  }

  const drawBrickPattern = (
    ctx,
    tilesAlongLength,
    tilesAlongWidth,
    tileLength,
    tileWidth,
    spacing,
    canvasWidth,
    canvasHeight,
  ) => {
    for (let j = 0; j < tilesAlongWidth; j++) {
      const rowOffset = j % 2 === 0 ? 0 : (tileLength + spacing) / 2

      for (let i = -1; i < tilesAlongLength; i++) {
        const x = rowOffset + i * (tileLength + spacing)
        const y = j * (tileWidth + spacing)

        // Skip tiles that are completely outside the canvas
        if (x + tileLength < 0 || x > canvasWidth) continue

        // Determine if this is an edge tile
        const isLeftEdge = x < spacing
        const isRightEdge = x + tileLength > canvasWidth - spacing
        const isTopEdge = j === 0
        const isBottomEdge = j === tilesAlongWidth - 1

        const isCorner =
          (isLeftEdge && isTopEdge) ||
          (isLeftEdge && isBottomEdge) ||
          (isRightEdge && isTopEdge) ||
          (isRightEdge && isBottomEdge)

        const isEdge = isLeftEdge || isRightEdge || isTopEdge || isBottomEdge

        // Set tile color based on type
        if (isCorner) {
          ctx.fillStyle = "#ffcccc" // Light red for corner tiles
        } else if (isEdge) {
          ctx.fillStyle = "#ffffcc" // Light yellow for edge tiles
        } else {
          ctx.fillStyle = "#ffffff" // White for whole tiles
        }

        // Draw tile
        ctx.fillRect(x, y, tileLength, tileWidth)

        // Draw tile border
        ctx.strokeStyle = "#cccccc"
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, tileLength, tileWidth)
      }
    }
  }

  const drawHerringbonePattern = (
    ctx,
    tilesAlongLength,
    tilesAlongWidth,
    tileLength,
    tileWidth,
    spacing,
    canvasWidth,
    canvasHeight,
  ) => {
    // Herringbone pattern is complex - this is a simplified version
    const unitSize = tileLength + tileWidth + spacing * 2
    const unitsAlongLength = Math.ceil(canvasWidth / unitSize)
    const unitsAlongWidth = Math.ceil(canvasHeight / unitSize)

    for (let i = -1; i <= unitsAlongLength; i++) {
      for (let j = -1; j <= unitsAlongWidth; j++) {
        const baseX = i * unitSize
        const baseY = j * unitSize

        // Draw the L-shaped pair of tiles
        // First tile (vertical)
        drawHerringboneTile(ctx, baseX, baseY, tileWidth, tileLength, spacing, canvasWidth, canvasHeight)

        // Second tile (horizontal)
        drawHerringboneTile(
          ctx,
          baseX + tileWidth + spacing,
          baseY,
          tileLength,
          tileWidth,
          spacing,
          canvasWidth,
          canvasHeight,
        )
      }
    }
  }

  const drawHerringboneTile = (ctx, x, y, width, height, spacing, canvasWidth, canvasHeight) => {
    // Skip tiles that are completely outside the canvas
    if (x + width < 0 || x > canvasWidth || y + height < 0 || y > canvasHeight) return

    // Determine if this is an edge tile
    const isLeftEdge = x < spacing
    const isRightEdge = x + width > canvasWidth - spacing
    const isTopEdge = y < spacing
    const isBottomEdge = y + height > canvasHeight - spacing

    const isCorner =
      (isLeftEdge && isTopEdge) ||
      (isLeftEdge && isBottomEdge) ||
      (isRightEdge && isTopEdge) ||
      (isRightEdge && isBottomEdge)

    const isEdge = isLeftEdge || isRightEdge || isTopEdge || isBottomEdge

    // Set tile color based on type
    if (isCorner) {
      ctx.fillStyle = "#ffcccc" // Light red for corner tiles
    } else if (isEdge) {
      ctx.fillStyle = "#ffffcc" // Light yellow for edge tiles
    } else {
      ctx.fillStyle = "#ffffff" // White for whole tiles
    }

    // Draw tile
    ctx.fillRect(x, y, width, height)

    // Draw tile border
    ctx.strokeStyle = "#cccccc"
    ctx.lineWidth = 1
    ctx.strokeRect(x, y, width, height)
  }

  const drawDiagonalPattern = (
    ctx,
    tilesAlongLength,
    tilesAlongWidth,
    tileLength,
    tileWidth,
    spacing,
    canvasWidth,
    canvasHeight,
  ) => {
    // Save the current context state
    ctx.save()

    // Translate to the center of the canvas
    ctx.translate(canvasWidth / 2, canvasHeight / 2)

    // Rotate 45 degrees
    ctx.rotate(Math.PI / 4)

    // Scale to fit the rotated pattern
    const scale = 0.7
    ctx.scale(scale, scale)

    // Translate back to draw from the top-left
    ctx.translate(-canvasWidth / 2, -canvasHeight / 2)

    // Draw the grid pattern
    drawGridPattern(
      ctx,
      Math.ceil(tilesAlongLength * 1.5),
      Math.ceil(tilesAlongWidth * 1.5),
      tileLength,
      tileWidth,
      spacing,
      canvasWidth * 2,
      canvasHeight * 2,
    )

    // Restore the context
    ctx.restore()
  }

  const handleDownloadImage = () => {
    const canvas = canvasRef.current
    const image = canvas.toDataURL("image/png")

    const link = document.createElement("a")
    link.href = image
    link.download = `${calculation.name}-tile-layout.png`
    link.click()
  }

  const handleGeneratePDF = async () => {
    setGenerating(true)
    setSuccessMessage("")
    setErrorMessage("")

    try {
      // Generate PDF report via API
      const response = await axios.get(`/api/calculations/${calculationId}/report`)

      setSuccessMessage("PDF report generated successfully!")
      setPdfUrl(response.data.reportUrl)

      // Update the calculation with the report path
      setCalculation({
        ...calculation,
        reportPath: response.data.reportUrl,
      })
    } catch (error) {
      console.error("Error generating PDF:", error)
      setErrorMessage("Failed to generate PDF report. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const handleUpdateStatus = async (status) => {
    try {
      // Update calculation status in the database
      const response = await axios.put(`/api/calculations/${calculationId}`, {
        status,
      })

      setCalculation(response.data)
      setSuccessMessage(`Project status updated to ${status}`)
    } catch (error) {
      console.error("Error updating status:", error)
      setErrorMessage("Failed to update project status. Please try again.")
    }
  }

  if (loading) {
    return (
      <Layout>
        <LayoutContainer>
          <Loader />
        </LayoutContainer>
      </Layout>
    )
  }

  if (!calculation) {
    return (
      <Layout>
        <LayoutContainer>
          <ErrorMessage>Calculation not found.</ErrorMessage>
          <Button as={Link} to="/calculator">
            Create New Calculation
          </Button>
        </LayoutContainer>
      </Layout>
    )
  }

  return (
    <Layout>
      <LayoutContainer>
        <PageHeader>
          <PageTitle>{calculation.name} - Tile Layout</PageTitle>
          <Button as={Link} to="/dashboard">
            Back to Dashboard
          </Button>
        </PageHeader>

        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

        <LayoutControls>
          <Button onClick={handleDownloadImage}>Download Image</Button>
          <Button variant={pdfUrl ? "secondary" : "outline"} onClick={handleGeneratePDF} disabled={generating}>
            {generating ? "Generating PDF..." : "Generate PDF Report"}
          </Button>
          {pdfUrl && (
            <Button as="a" href={pdfUrl} target="_blank" rel="noopener noreferrer">
              View PDF Report
            </Button>
          )}

          <div style={{ marginLeft: "auto" }}>
            <Select
              value={calculation.status}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              style={{ marginRight: "10px" }}
            >
              <option value="draft">Draft</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Select>
          </div>
        </LayoutControls>

        <CanvasContainer>
          <Canvas ref={canvasRef} />
        </CanvasContainer>

        <DetailsContainer>
          <Card title="Calculation Details">
            <DetailsList>
              <DetailItem>
                <DetailLabel>Room Dimensions</DetailLabel>
                <DetailValue>
                  {calculation.roomLength} × {calculation.roomWidth} m
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Room Area</DetailLabel>
                <DetailValue>{(calculation.roomLength * calculation.roomWidth).toFixed(2)} m²</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Tile Size</DetailLabel>
                <DetailValue>
                  {calculation.tileLength} × {calculation.tileWidth} cm
                </DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Spacing</DetailLabel>
                <DetailValue>{calculation.spacing} mm</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Pattern</DetailLabel>
                <DetailValue>{calculation.pattern.charAt(0).toUpperCase() + calculation.pattern.slice(1)}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Total Tiles</DetailLabel>
                <DetailValue>{calculation.results.tilesNeeded}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Whole Tiles</DetailLabel>
                <DetailValue>{calculation.results.wholeTiles}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>Cut Tiles</DetailLabel>
                <DetailValue>{calculation.results.cutTiles}</DetailValue>
              </DetailItem>

              <DetailItem>
                <DetailLabel>With 10% Waste</DetailLabel>
                <DetailValue>{calculation.results.totalTilesWithWaste}</DetailValue>
              </DetailItem>

              {calculation.results.estimatedCost && (
                <DetailItem>
                  <DetailLabel>Estimated Cost</DetailLabel>
                  <DetailValue>${calculation.results.estimatedCost}</DetailValue>
                </DetailItem>
              )}

              {calculation.results.installationHours && (
                <DetailItem>
                  <DetailLabel>Installation Time</DetailLabel>
                  <DetailValue>{calculation.results.installationHours} hours</DetailValue>
                </DetailItem>
              )}
            </DetailsList>
          </Card>

          <LegendContainer>
            <LegendTitle>Layout Legend</LegendTitle>

            <LegendItem>
              <LegendColor color="#ffffff" border="#cccccc" />
              <LegendText>Whole Tiles</LegendText>
            </LegendItem>

            <LegendItem>
              <LegendColor color="#ffffcc" border="#cccccc" />
              <LegendText>Edge Tiles (Cut)</LegendText>
            </LegendItem>

            <LegendItem>
              <LegendColor color="#ffcccc" border="#cccccc" />
              <LegendText>Corner Tiles (Cut)</LegendText>
            </LegendItem>

            <LegendItem>
              <LegendColor color="#cccccc" />
              <LegendText>Tile Spacing ({calculation.spacing} mm)</LegendText>
            </LegendItem>
          </LegendContainer>
        </DetailsContainer>

        {calculation.results.calculationExplanation && (
          <ExplanationContainer>
            <ExplanationTitle>Calculation Explanation</ExplanationTitle>
            <ExplanationContent>
              {calculation.results.calculationExplanation.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("##")) {
                  const headingText = paragraph.replace(/^##\s+/, "")
                  return <h2 key={index}>{headingText}</h2>
                } else if (paragraph.startsWith("###")) {
                  const headingText = paragraph.replace(/^###\s+/, "")
                  return <h3 key={index}>{headingText}</h3>
                } else if (paragraph.trim() !== "") {
                  return <p key={index}>{paragraph}</p>
                }
                return null
              })}
            </ExplanationContent>
          </ExplanationContainer>
        )}
      </LayoutContainer>
    </Layout>
  )
}

export default TileLayout
