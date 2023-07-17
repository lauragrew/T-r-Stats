const Player = require("../models/playerModel");
const Team = require("../models/teamModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.createTeamAndPlayers = catchAsync(async (req, res, next) => {
  req.body.user = req.user._id;

  // Create or select the team
  let team;
  if (req.body.teamSelect && req.body.teamSelect !== "") {
    // If teamSelect is provided and not empty, retrieve the team
    team = await Team.findById(req.body.teamSelect);
  } else {
    // Otherwise, create a new team
    team = await Team.create({ name: req.body.teamName, user: req.user._id });
  }

  // Collect all players' names and numbers
  const playersData = [];
  for (let i = 1; i <= 26; i++) {
    const playerName = req.body[`playerName${i}`];
    if (playerName) {
      playersData.push({
        name: playerName,
        number: i,
        team: team._id,
        user: req.user._id,
      });
    }
  }

  // Create players and associate them with the team
  const players = await Player.create(playersData);

  // Redirect to the game stats page or wherever you want to go next
  res.redirect("/game/stats"); // Change "/game/stats" to your desired URL
});
