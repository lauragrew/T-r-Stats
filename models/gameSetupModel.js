const mongoose = require("mongoose");

// Define the PlayerSetup schema
const playerSetupSchema = new mongoose.Schema({
  position: {
    type: String,
    enum: [
      "GK",
      "LB",
      "FB",
      "RB",
      "LWB",
      "CHB",
      "RWB",
      "MF1",
      "MF2",
      "LHF",
      "CHF",
      "RHF",
      "LCF",
      "FF",
      "RCF",
    ],
    required: true,
  },
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  playerName: {
    type: String,
    required: true,
  },
});

// Define the GameSetup schema
const gameSetupSchema = new mongoose.Schema({
  team1Name: {
    type: String,
    required: true,
  },
  team2Name: {
    type: String,
    required: true,
  },
  gameDescription: {
    type: String,
    required: true,
  },
  selectedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },
  playerSetup: [playerSetupSchema],
});

const GameSetup = mongoose.model("GameSetup", gameSetupSchema);

module.exports = GameSetup;
