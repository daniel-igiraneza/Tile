const express = require("express");
const router = express.Router();
const Calculation = require("../models/Calculation");
const { calculateTiles } = require("../utils/tileCalculator");
const PDFDocument = require('pdfkit');

const { authenticateToken, isAdmin } = require("../middleware/auth");

// Apply authentication middleware to all routes below
router.use(authenticateToken);

// @route   POST /api/calculations/calculate
// @desc    Calculate tiles without saving to database
// @access  Private
router.post("/calculate", async (req, res) => {
  try {
    const { roomLength, roomWidth, tileLength, tileWidth, spacing, pattern } = req.body;

    // Calculate tile layout and quantities
    const results = calculateTiles(
      Number.parseFloat(roomLength),
      Number.parseFloat(roomWidth),
      Number.parseFloat(tileLength),
      Number.parseFloat(tileWidth),
      Number.parseFloat(spacing || 2),
      pattern || "grid"
    );

    res.json(results);
  } catch (error) {
    console.error("Calculate tiles error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/calculations
// @desc    Get all calculations for the current user
// @access  Private
router.get("/", async (req, res) => {
  try {
    const calculations = await Calculation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(calculations);
  } catch (error) {
    console.error("Get calculations error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/calculations/:id
// @desc    Get a specific calculation
// @access  Private
router.get("/:id", async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id);

    if (!calculation) {
      return res.status(404).json({ message: "Calculation not found" });
    }

    // Check ownership or admin
    if (calculation.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to access this calculation" });
    }

    res.json(calculation);
  } catch (error) {
    console.error("Get calculation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/calculations
// @desc    Create a new calculation
// @access  Private
router.post("/", async (req, res) => {
  try {
    const { name, roomLength, roomWidth, tileLength, tileWidth, spacing, pattern, results, planImage } = req.body;

    const calculation = new Calculation({
      user: req.user._id,
      name,
      roomLength,
      roomWidth,
      tileLength,
      tileWidth,
      spacing,
      pattern,
      results,
      planImage,
      status: "draft",
    });

    await calculation.save();
    res.status(201).json(calculation);
  } catch (error) {
    console.error("Create calculation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/calculations/:id
// @desc    Update a calculation
// @access  Private
router.put("/:id", async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id);

    if (!calculation) {
      return res.status(404).json({ message: "Calculation not found" });
    }

    if (calculation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this calculation" });
    }

    const { name, roomLength, roomWidth, tileLength, tileWidth, spacing, pattern, results, planImage, status } = req.body;

    if (name) calculation.name = name;
    if (roomLength) calculation.roomLength = roomLength;
    if (roomWidth) calculation.roomWidth = roomWidth;
    if (tileLength) calculation.tileLength = tileLength;
    if (tileWidth) calculation.tileWidth = tileWidth;
    if (spacing !== undefined) calculation.spacing = spacing;
    if (pattern) calculation.pattern = pattern;
    if (results) calculation.results = results;
    if (planImage !== undefined) calculation.planImage = planImage;
    if (status) calculation.status = status;

    await calculation.save();

    res.json(calculation);
  } catch (error) {
    console.error("Update calculation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/calculations/:id
// @desc    Delete a calculation
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const calculation = await Calculation.findById(req.params.id);

    if (!calculation) {
      return res.status(404).json({ message: "Calculation not found" });
    }

    if (calculation.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this calculation" });
    }

    await calculation.deleteOne();

    res.json({ message: "Calculation removed" });
  } catch (error) {
    console.error("Delete calculation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/calculations/generate-pdf
// @desc    Generate PDF from calculation results
// @access  Private
router.post('/generate-pdf', async (req, res) => {
  try {
    const { results } = req.body;
    if (!results) {
      return res.status(400).json({ message: 'Results data is required to generate PDF' });
    }

    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res
        .writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=calculation.pdf',
          'Content-Length': pdfData.length,
        })
        .end(pdfData);
    });

    // PDF Content
    doc.fontSize(18).text('Tile Calculation Results', { underline: true });
    doc.moveDown();

    for (const [key, value] of Object.entries(results)) {
      doc.fontSize(12).text(`${key}: ${value}`);
    }

    doc.end();
  } catch (error) {
    console.error('Generate PDF error:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

module.exports = router;
