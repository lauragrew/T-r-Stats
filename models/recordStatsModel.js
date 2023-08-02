// models/recordStats.js
const mongoose = require("mongoose");

const recordStatsSchema = new mongoose.Schema({
  gameSetup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GameSetup",
    required: true,
  },
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  statType: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});

const RecordStats = mongoose.model("RecordStats", recordStatsSchema);

module.exports = RecordStats;
