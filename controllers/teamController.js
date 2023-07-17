// controllers/teamController.js
const Team = require("../models/teamModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Player = require("../models/playerModel");

// WORKING
exports.createTeamWithPlayers = catchAsync(async (req, res, next) => {
  console.log("Request Body:", req.body);

  const { teamName, players } = req.body;
  console.log("Players Data:", players);

  // Check if player numbers are unique within the team
  const jerseyNumbers = players.map((player) => player.jerseyNumber);
  const uniqueJerseyNumbers = new Set(jerseyNumbers);
  if (jerseyNumbers.length !== uniqueJerseyNumbers.size) {
    return next(
      new AppError("Player numbers must be unique within the team!", 400)
    );
  }

  try {
    // Save the team with players' details in the players array
    const newTeam = await Team.create({
      name: teamName,
      user: req.user._id,
      players: players,
    });

    console.log("New Team with Players:", newTeam);

    // Create player documents and save them in the Player collection
    const playerDocs = players.map((player) => ({
      ...player,
      team: newTeam._id,
      user: req.user._id,
    }));
    console.log("Player Documents to be Inserted:", playerDocs);

    const insertedPlayers = await Player.insertMany(playerDocs);
    console.log("Number of players inserted:", insertedPlayers.length);

    res.status(201).json({
      status: "success",
      data: {
        team: newTeam,
      },
    });
  } catch (error) {
    console.error("Error while creating team and inserting players:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});

// WORKING
exports.getAllTeams = catchAsync(async (req, res, next) => {
  const teams = await Team.find({ user: req.user._id });
  res.status(200).json({
    status: "success",
    result: teams.length,
    data: {
      teams,
    },
  });
});

// WORKING
exports.getOneTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findOne({
    _id: req.params.id,
    user: req.user._id,
  }); // Fetch team by ID and user field matching the logged-in user's ID
  if (!team) {
    return next(new AppError("No team found with this ID!", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      team,
    },
  });
});

exports.deleteTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findByIdAndDelete(req.params.id);
  if (!team) {
    return next(new AppError("No team found with this ID!", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.updatePlayerNumber = catchAsync(async (req, res, next) => {
  const { playerId, newNumber } = req.body;
  const player = await Player.findById(playerId);

  if (!player || player.user.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not authorized to update this player.", 403)
    );
  }

  player.number = newNumber;
  await player.save();

  res.status(200).json({
    status: "success",
    data: {
      player,
    },
  });
});

exports.updateTeam = catchAsync(async (req, res, next) => {
  const { teamId } = req.params;
  const { teamName } = req.body;

  const team = await Team.findById(teamId);
  if (!team) {
    return next(new AppError("No team found with this ID!", 404));
  }

  // Check if the logged-in user owns the team
  if (team.user.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not authorized to update this team.", 403)
    );
  }

  // Update the team name
  team.name = teamName;
  await team.save();

  res.status(200).json({
    status: "success",
    data: {
      team,
    },
  });
});

exports.addPlayerToTeam = catchAsync(async (req, res, next) => {
  const { playerName, jerseyNumber } = req.body;
  const { teamId } = req.params;

  // Find the team by ID
  const team = await Team.findById(teamId);
  if (!team) {
    return next(new AppError("No team found with this ID!", 404));
  }

  // Check if the logged-in user owns the team
  if (team.user.toString() !== req.user._id.toString()) {
    return next(
      new AppError("You are not authorized to update this team.", 403)
    );
  }

  // Check if the jersey number is already taken in the team
  if (team.players.some((player) => player.number === jerseyNumber)) {
    return next(new AppError("Jersey number already taken in the team!", 400));
  }

  // Add the new player to the team
  team.players.push({ name: playerName, number: jerseyNumber });
  await team.save();

  res.status(201).json({
    status: "success",
    data: {
      team,
    },
  });
});

// WORKING
exports.getAllPlayersInTeam = catchAsync(async (req, res, next) => {
  const { teamId } = req.params;

  try {
    // Find the team by ID
    const team = await Team.findById(teamId);

    if (!team) {
      return next(new AppError("No team found with this ID!", 404));
    }

    // Check if the logged-in user owns the team
    if (team.user.toString() !== req.user._id.toString()) {
      return next(
        new AppError(
          "You are not authorized to access this team's players.",
          403
        )
      );
    }

    // Find all players in the team
    const players = await Player.find({ team: teamId });

    res.status(200).json({
      status: "success",
      data: {
        players,
      },
    });
  } catch (error) {
    console.error(
      `Error while retrieving players for the team: ${error.message}`
    );
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
});
