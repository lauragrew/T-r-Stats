const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the player's name"],
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: [true, "Please specify the player's team"],
  },
  number: {
    type: Number,
    required: [true, "Please enter the player's number"],
  },
  position: {
    type: String,
    required: [true, "Please enter the player's position"],
  },
});

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
