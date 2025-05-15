const Calculation = require("../models/Calculation")
const { calculateTiles } = require("../utils/tileCalculator")
const { generateTileReport } = require("../utils/pdfGenerator")
const path = require("path")
const fs = require("fs")

/**
 * Calculate tiles without saving to database
 */
const calculateOnly = async (req, res) => {
  try {
    const { roomLength, roomWidth, tileLength, tileWidth, spacing, pattern } = req.body

    // Calculate tile layout and quantities
    const results = calculateTiles(
      Number.parseFloat(roomLength),
      Number.parseFloat(roomWidth),
      Number.parseFloat(tileLength),
      Number.parseFloat(tileWidth),
      Number.parseFloat(spacing || 2),
      pattern || "grid",
    )

    res.json(results)
  } catch (error) {
    console.error("Calculate only error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

/**
 * Get all calculations for the current user
 */
const getUserCalculations = async (req, res) => {
  try {
    const calculations = await Calculation.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(calculations)
  } catch (error) {
    console.error("Get calculations error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

/**
 * Get a specific calculation
 */
const getCalculation = async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id)

    if (!calculation) {
      return res.status(404).json({ message: "Calculation not found" })
    }

    // Check if the calculation belongs to the current user or user is admin
    if (calculation.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this calculation" })
    }

    res.json(calculation)
  } catch (error) {
    console.error("Get calculation error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

/**
 * Create a new calculation
 */
const createCalculation = async (req, res) => {
  try {
    const { name, roomLength, roomWidth, tileLength, tileWidth, spacing, pattern, results, planImage } = req.body

    // Create new calculation
    const calculation = new Calculation({
      user: req.user._id,
      name,
      roomLength: Number.parseFloat(roomLength),
      roomWidth: Number.parseFloat(roomWidth),
      tileLength: Number.parseFloat(tileLength),
      tileWidth: Number.parseFloat(tileWidth),
      spacing: Number.parseFloat(spacing || 2),
      pattern: pattern || "grid",
      results,
      planImage,
      status: "draft",
    })

    // Save calculation to database
    await calculation.save()

    res.status(201).json(calculation)
  } catch (error) {
    console.error("Create calculation error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

/**
 * Update a calculation
 */
const updateCalculation = async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id)

    if (!calculation) {
      return res.status(404).json({ message: "Calculation not found" })
    }

    // Check if the calculation belongs to the current user
    if (calculation.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this calculation" })
    }

    // Update calculation fields
    const { name, roomLength, roomWidth, tileLength, tileWidth, spacing, pattern, planImage, status } = req.body

    if (name) calculation.name = name

    // If any dimension or pattern changes, recalculate results
    let shouldRecalculate = false

    if (roomLength && Number.parseFloat(roomLength) !== calculation.roomLength) {
      calculation.roomLength = Number.parseFloat(roomLength)
      shouldRecalculate = true
    }

    if (roomWidth && Number.parseFloat(roomWidth) !== calculation.roomWidth) {
      calculation.roomWidth = Number.parseFloat(roomWidth)
      shouldRecalculate = true
    }

    if (tileLength && Number.parseFloat(tileLength) !== calculation.tileLength) {
      calculation.tileLength = Number.parseFloat(tileLength)
      shouldRecalculate = true
    }

    if (tileWidth && Number.parseFloat(tileWidth) !== calculation.tileWidth) {
      calculation.tileWidth = Number.parseFloat(tileWidth)
      shouldRecalculate = true
    }

    if (spacing !== undefined && Number.parseFloat(spacing) !== calculation.spacing) {
      calculation.spacing = Number.parseFloat(spacing)
      shouldRecalculate = true
    }

    if (pattern && pattern !== calculation.pattern) {
      calculation.pattern = pattern
      shouldRecalculate = true
    }

    if (planImage !== undefined) calculation.planImage = planImage
    if (status) calculation.status = status

    // Recalculate results if needed
    if (shouldRecalculate) {
      calculation.results = calculateTiles(
        calculation.roomLength,
        calculation.roomWidth,
        calculation.tileLength,
        calculation.tileWidth,
        calculation.spacing,
        calculation.pattern,
      )
    }

    // Save updated calculation
    await calculation.save()

    res.json(calculation)
  } catch (error) {
    console.error("Update calculation error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

/**
 * Delete a calculation
 */
const deleteCalculation = async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id)

    if (!calculation) {
      return res.status(404).json({ message: "Calculation not found" })
    }

    // Check if the calculation belongs to the current user or user is admin
    if (calculation.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this calculation" })
    }

    // Delete any associated reports
    if (calculation.reportPath) {
      try {
        fs.unlinkSync(calculation.reportPath)
      } catch (err) {
        console.error("Error deleting report file:", err)
      }
    }

    await calculation.remove()

    res.json({ message: "Calculation removed" })
  } catch (error) {
    console.error("Delete calculation error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

/**
 * Generate a PDF report for a calculation
 */
const generateReport = async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id)

    if (!calculation) {
      return res.status(404).json({ message: "Calculation not found" })
    }

    // Check if the calculation belongs to the current user or user is admin
    if (calculation.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this calculation" })
    }

    // Create reports directory if it doesn't exist
    const reportsDir = path.join(__dirname, "../uploads/reports")
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true })
    }

    // Generate a unique filename
    const filename = `report-${calculation._id}-${Date.now()}.pdf`
    const outputPath = path.join(reportsDir, filename)

    // Generate the PDF report
    await generateTileReport(calculation, outputPath)

    // Update the calculation with the report path
    calculation.reportPath = `/api/calculations/reports/${filename}`
    await calculation.save()

    res.json({
      message: "Report generated successfully",
      reportUrl: calculation.reportPath,
    })
  } catch (error) {
    console.error("Generate report error:", error)
    res.status(500).json({ message: "Failed to generate report" })
  }
}

/**
 * Get a generated report
 */
const getReport = (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(__dirname, "../uploads/reports", filename)

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Report not found" })
    }

    // Send the file
    res.sendFile(filePath)
  } catch (error) {
    console.error("Get report error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  calculateOnly,
  getUserCalculations,
  getCalculation,
  createCalculation,
  updateCalculation,
  deleteCalculation,
  generateReport,
  getReport,
}
