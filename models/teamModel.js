const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter the team name"],
    unique: true,
  },
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
  matches: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
    },
  ],
});

const Team = mongoose.model("Team", teamSchema);
