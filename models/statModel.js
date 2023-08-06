const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
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
  squad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Squad",
    required: true,
  },
  statType: {
    type: String,
    enum: [
      "Tackle",
      "Save",
      "Turnover for",
      "Turnover Against",
      "Goal",
      "Point",
      "Dropped Short",
      "Wide",
      "Free Conceded",
      "Kickout Won",
      "Kickout Lost",
      // Add more stat types as needed
    ],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Stat = mongoose.model("Stat", statSchema);

module.exports = Stat;
