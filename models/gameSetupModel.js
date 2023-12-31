const mongoose = require("mongoose");

const playerStatsSchema = new mongoose.Schema({
  statType: {
    type: String,
    enum: [
      "Tackle",
      "Save",
      "Turnover for",
      "Turnover against",
      "Goal",
      "Point",
      "Dropped short",
      "Wide",
      "Free conceded",
      "Kickout won",
      "Kickout lost",
    ],
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

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
  playerNumber: {
    type: Number,
    min: 1,
    max: 30,
    required: true,
  },
  stats: [playerStatsSchema], // array to store player stats
});

const gameSetupSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  oppositionName: {
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
  playerSetup: [playerSetupSchema], // array to store player setups including stats
  ended: {
    type: Boolean,
    default: false, // default value is set to false (game is not ended)
  },
  endDate: {
    type: Date,
    default: null,
  },
});

const GameSetup = mongoose.model("GameSetup", gameSetupSchema);

module.exports = GameSetup;
