const catchAsync = require("../utils/catchAsync");
const Team = require("../models/teamModel");
const Player = require("../models/playerModel");
const factory = require("../controllers/handlerFactory");

exports.getGameSetup = async (req, res) => {
  try {
    // Retrieve teams and players from the database
    const teams = await Team.find();
    const players = await Player.find();

    res.status(200).render("gameSetup", {
      title: "Tír Stats | Game Setup",
      teams: teams,
      players: players,
    });
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
};

// MY APP ********************************************************

exports.getStatsMain = (req, res) => {
  res.status(200).render("statsMain", {
    title: "Tír Stats",
  });
};

exports.getStatsSignup = (req, res) => {
  res.status(200).render("statsSignup", {
    title: "Tír Stats | Signup ",
  });
};

exports.getStatsSignup1 = (req, res) => {
  res.status(200).render("statsSignup1", {
    title: "Tír Stats | Signup ",
  });
};

exports.getStatsLogin = (req, res) => {
  res.status(200).render("statsLogin", {
    title: "Tír Stats | Login",
  });
};

// exports.getGameSetup = (req, res) => {
//   res.status(200).render("gameSetup", {
//     title: "Tír Stats | Game Setup",
//   });
// };

// this is the routes with catch async *********

// exports.getStatsMain = catchAsync(async (req, res, next) => {
//   res.status(200).render("statsMain", {
//     title: "Tír Stats",
//   });
// });

// exports.getStatsSignup = catchAsync(async (req, res, next) => {
//   res.status(200).render("statsSignup", {
//     title: "Tír Stats | Signup ",
//   });
// });
