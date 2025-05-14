const PDFDocument = require("pdfkit")
const fs = require("fs")
const path = require("path")

/**
 * Generate a PDF report for a tile calculation
 * @param {Object} calculation - The calculation object
 * @param {String} outputPath - Path to save the PDF
 * @returns {Promise<String>} - Path to the generated PDF
 */
const generateTileReport = async (calculation, outputPath = null) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({ margin: 50 })

      // If outputPath is not provided, generate a filename
      if (!outputPath) {
        const uploadsDir = path.join(__dirname, "../uploads/reports")

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true })
        }

        outputPath = path.join(uploadsDir, `tile-report-${calculation._id || Date.now()}.pdf`)
      }

      // Pipe the PDF to a file
      const stream = fs.createWriteStream(outputPath)
      doc.pipe(stream)

      // Add content to the PDF
      addReportContent(doc, calculation)

      // Finalize the PDF and end the stream
      doc.end()

      stream.on("finish", () => {
        resolve(outputPath)
      })

      stream.on("error", (error) => {
        reject(error)
      })
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * Add content to the PDF document
 * @param {PDFDocument} doc - The PDF document
 * @param {Object} calculation - The calculation object
 */
const addReportContent = (doc, calculation) => {
  // Add title
  doc.fontSize(25).font("Helvetica-Bold").text("Tile Calculation Report", { align: "center" }).moveDown(0.5)

  // Add project name
  doc.fontSize(16).font("Helvetica-Bold").text(`Project: ${calculation.name}`, { align: "center" }).moveDown(1)

  // Add date
  doc
    .fontSize(12)
    .font("Helvetica")
    .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: "right" })
    .moveDown(2)

  // Add room details section
  doc.fontSize(14).font("Helvetica-Bold").text("Room Details").moveDown(0.5)

  doc
    .fontSize(12)
    .font("Helvetica")
    .text(`Room Length: ${calculation.roomLength} meters`)
    .text(`Room Width: ${calculation.roomWidth} meters`)
    .text(`Room Area: ${calculation.roomLength * calculation.roomWidth} square meters`)
    .moveDown(1)

  // Add tile details section
  doc.fontSize(14).font("Helvetica-Bold").text("Tile Details").moveDown(0.5)

  doc
    .fontSize(12)
    .font("Helvetica")
    .text(`Tile Size: ${calculation.tileLength} cm × ${calculation.tileWidth} cm`)
    .text(`Spacing: ${calculation.spacing} mm`)
    .text(`Pattern: ${calculation.pattern.charAt(0).toUpperCase() + calculation.pattern.slice(1)}`)
    .moveDown(1)

  // Add calculation results section
  doc.fontSize(14).font("Helvetica-Bold").text("Calculation Results").moveDown(0.5)

  // Create a table-like structure for results
  const results = calculation.results
  const tableData = [
    { label: "Total Tiles Needed", value: results.tilesNeeded },
    { label: "Whole Tiles", value: results.wholeTiles },
    { label: "Cut Tiles", value: results.cutTiles },
    { label: "Edge Tiles", value: results.edgeTiles },
    { label: "Corner Tiles", value: results.cornerTiles },
    { label: "Total with 10% Waste", value: results.totalTilesWithWaste },
    { label: "Tiles Along Length", value: results.tilesAlongLength },
    { label: "Tiles Along Width", value: results.tilesAlongWidth },
  ]

  // Draw the table
  const tableTop = doc.y
  const tableLeft = 50
  const colWidth = 250
  const rowHeight = 25

  // Draw table headers
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Measurement", tableLeft, tableTop)
    .text("Value", tableLeft + colWidth, tableTop)
    .moveDown(0.5)

  // Draw table rows
  let currentY = tableTop + rowHeight
  tableData.forEach((row) => {
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(row.label, tableLeft, currentY)
      .text(row.value.toString(), tableLeft + colWidth, currentY)

    currentY += rowHeight
  })

  doc.moveDown(2)

  // Add explanation section if available
  if (results.calculationExplanation) {
    doc.fontSize(14).font("Helvetica-Bold").text("Calculation Explanation").moveDown(0.5)

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(results.calculationExplanation.replace(/##|###/g, "").trim())
      .moveDown(1)
  }

  // Add recommendations section
  doc.fontSize(14).font("Helvetica-Bold").text("Recommendations").moveDown(0.5)

  doc
    .fontSize(12)
    .font("Helvetica")
    .text("1. Purchase at least 10% extra tiles to account for cuts, breakage, and future repairs.")
    .text(`2. For ${calculation.pattern} pattern, ensure proper layout planning before installation.`)
    .text("3. Consider professional installation for complex patterns and large areas.")
    .text("4. Store a few extra tiles for potential future repairs.")
    .moveDown(2)

  // Add footer
  const pageBottom = doc.page.height - doc.page.margins.bottom
  doc
    .fontSize(10)
    .font("Helvetica-Italic")
    .text("Generated by TileCalc - The Ultimate Tile Calculator", 50, pageBottom - 20, { align: "center" })
}

module.exports = { generateTileReport }
