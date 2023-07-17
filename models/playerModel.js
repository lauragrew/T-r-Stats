const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: [true, "Please enter the player's name"],
  },
  jerseyNumber: {
    type: Number,
    required: [true, "Please enter the player's number"],
    unique: true,
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Player = mongoose.model("Player", playerSchema);
module.exports = Player;
