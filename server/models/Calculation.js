const mongoose = require("mongoose")

const CalculationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  roomLength: {
    type: Number,
    required: true,
  },
  roomWidth: {
    type: Number,
    required: true,
  },
  tileLength: {
    type: Number,
    required: true,
  },
  tileWidth: {
    type: Number,
    required: true,
  },
  spacing: {
    type: Number,
    default: 2, // Default 2mm spacing
  },
  pattern: {
    type: String,
    enum: ["grid", "brick", "herringbone", "diagonal"],
    default: "grid",
  },
  planImage: {
    type: String,
    default: null,
  },
  results: {
    tilesNeeded: Number,
    wholeTiles: Number,
    cutTiles: Number,
    edgeTiles: Number,
    cornerTiles: Number,
    totalTileArea: Number,
    totalTilesWithWaste: Number,
    tilesAlongLength: Number,
    tilesAlongWidth: Number,
  },
  status: {
    type: String,
    enum: ["draft", "in-progress", "completed"],
    default: "draft",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt field before saving
CalculationSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model("Calculation", CalculationSchema)