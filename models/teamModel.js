const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the team name"],
    unique: true,
  },
  players: [
    {
      playerName: {
        type: String,
        required: [true, "Please enter the player's name"],
      },
      jerseyNumber: {
        type: Number,
        required: [true, "Please enter the player's number"],
      },
    },
  ],
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
