const Player = require("../models/playerModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// function to create a player
exports.createPlayer = catchAsync(async (req, res) => {
  const { firstName, lastName } = req.body;
  const squadId = req.params.squadId;
  const userId = req.user._id;

  const newPlayer = await Player.create({
    firstName,
    lastName,
    squad: squadId,
    user: userId,
  });

  // Redirect back to the viewPlayers page for the specific squad after adding the player
  res.redirect(`/viewPlayers/${squadId}`);
});

// function to delete a player
exports.deletePlayer = catchAsync(async (req, res) => {
  const playerId = req.params.playerId;
  console.log("Player ID to be deleted:", playerId);
  // find player and delete a player by ID
  await Player.findByIdAndDelete(playerId);

  // Send a JSON response for successful deletion
  res.status(200).json({
    status: "success",
    data: null,
  });
});

// function to get players by squad ID
exports.getPlayersBySquad = catchAsync(async (req, res) => {
  const { squad } = req.query;
  if (!squad) {
    return res.status(400).json({ error: "Squad ID is required" });
  }

  const players = await Player.find({ squad: squad }).exec();
  res.status(200).json({ status: "success", data: { players } });
});
