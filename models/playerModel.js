// models/playerModel.js

const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide a first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide a last name"],
  },
  photo: String,
  squad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Squad",
    required: [true, "A player must belong to a squad"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A player must belong to a user"],
  },
});

const Player = mongoose.model("Player", playerSchema);

module.exports = Player;
