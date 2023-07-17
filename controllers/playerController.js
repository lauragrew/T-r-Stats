// controllers/playerController.js
const Player = require("../models/playerModel");
const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/appError");

exports.createPlayer = catchAsync(async (req, res, next) => {
  const { playerName, jerseyNumber, teamId } = req.body;
  const player = await Player.create({
    name: playerName,
    number: jerseyNumber,
    team: teamId,
    user: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      player,
    },
  });
});

// WORKING
exports.getAllPlayersCreatedByUser = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const players = await Player.find({ user: userId });

  res.status(200).json({
    status: "success",
    result: players.length,
    data: {
      players,
    },
  });
});

// WORKING
exports.getOnePlayer = catchAsync(async (req, res, next) => {
  const playerId = req.params.id;

  const player = await Player.findOne({ _id: playerId, user: req.user._id });

  if (!player) {
    return next(new AppError("No player found with this ID!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      player,
    },
  });
});

exports.updatePlayer = catchAsync(async (req, res, next) => {
  const { playerId } = req.params;
  const { playerName, jerseyNumber } = req.body;

  const player = await Player.findById(playerId);
  if (!player) {
    return next(new AppError("No player found with this ID!", 404));
  }

  // Check if the logged-in user owns the player's team
  if (player.user.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not authorized to update this player.", 403)
    );
  }

  // Update player's details
  player.name = playerName;
  player.number = jerseyNumber;
  await player.save();

  res.status(200).json({
    status: "success",
    data: {
      player,
    },
  });
});

exports.deletePlayer = catchAsync(async (req, res, next) => {
  const player = await Player.findByIdAndDelete(req.params.playerId);
  if (!player) {
    return next(new AppError("No player found with this ID!", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
