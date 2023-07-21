const catchAsync = require("../utils/catchAsync");
const Squad = require("../models/squadModel");
const Player = require("../models/playerModel");
const factory = require("../controllers/handlerFactory");

// MY APP ********************************************************

exports.getStatsMain = (req, res) => {
  res.status(200).render("statsMain", {
    title: "Tír Stats",
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

exports.getDashboard = async (req, res) => {
  res.status(200).render("dashboard", {
    title: "Tír Stats | Dashboard",
  });
};

// Your route handler in squadController.js
exports.getViewSquads = catchAsync(async (req, res) => {
  console.log("Inside getViewSquads route handler");
  console.log("Authenticated User:", req.user); // Log the req.user object

  const squads = await Squad.find({ user: req.user._id }).populate(
    "user",
    "firstName lastName"
  );

  res.render("viewSquads", {
    title: "View Squads",
    squads: squads,
  });
});

exports.getViewPlayers = catchAsync(async (req, res) => {
  const { id } = req.params;

  console.log(id); // Add this line to check the squad ID received

  // Find the squad by ID (assuming you have the Squad model imported)
  const squad = await Squad.findById(id);

  if (!squad) {
    // Handle the case when the squad is not found
    return res.status(404).json({ error: "Squad not found" });
  }

  // Find the players associated with the squad
  const players = await Player.find({ squad: id });

  // Render the "viewPlayers" template and pass both squad and players data to it
  res.render("viewPlayers", { squad, players });
});

// In viewsController.js
exports.getCreateSquad = (req, res) => {
  res.render("createSquad"); // Assuming the Pug file is named "createSquad.pug"
};

exports.getAddPlayer = (req, res) => {
  const squadId = req.params.squadId; // Make sure the parameter name matches the one in the route

  // Render the "addPlayerProfile" view with the squadId
  res.render("addPlayerProfile", { squadId });
};

exports.getGameSetup = async (req, res) => {
  res.status(200).render("gameSetup", {
    title: "Tír Stats | Game Setup",
  });
};
