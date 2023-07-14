const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the player name"],
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Player = mongoose.model("Player", playerSchema);
module.exports = Player;
