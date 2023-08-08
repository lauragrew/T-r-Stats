const catchAsync = require("../utils/catchAsync");
const Squad = require("../models/squadModel");
const Player = require("../models/playerModel");
const GameSetup = require("../models/gameSetupModel");
const { fetchGameSetupById } = require("../controllers/gameSetupController");

// function to view the statsMain page
exports.getStatsMain = (req, res) => {
  res.status(200).render("statsMain", {
    title: "Tír Stats",
  });
};
// function to view the statsSignup1 page
exports.getStatsSignup1 = (req, res) => {
  res.status(200).render("statsSignup1", {
    title: "Tír Stats | Signup ",
  });
};

// function to view the statsLogin page
exports.getStatsLogin = (req, res) => {
  res.status(200).render("statsLogin", {
    title: "Tír Stats | Login",
  });
};

// function to view the dashboard page
exports.getDashboard = async (req, res) => {
  res.status(200).render("dashboard", {
    title: "Tír Stats | Dashboard",
  });
};

// // function to view the viewSquads page
exports.getViewSquads = catchAsync(async (req, res) => {
  console.log("Inside getViewSquads route handler");
  console.log("Authenticated User:", req.user);

  const squads = await Squad.find({ user: req.user._id }).populate(
    "user",
    "firstName lastName"
  );

  res.render("viewSquads", {
    title: "View Squads",
    squads: squads,
  });
});

// function to view the viewPlayers page
exports.getViewPlayers = catchAsync(async (req, res) => {
  const { id } = req.params;

  console.log(id); // check the squad ID is correct

  // Find the squad by ID
  const squad = await Squad.findById(id);

  if (!squad) {
    // error when the squad is not found
    return res.status(404).json({ error: "Squad not found" });
  }

  // Find the players associated with the squad
  const players = await Player.find({ squad: id });

  // View the "viewPlayers" page and pass both squad and players data to it
  res.render("viewPlayers", { squad, players });
});

// function to view the createSquad page
exports.getCreateSquad = (req, res) => {
  res.render("createSquad");
};

// function to view the addPlayerProfile page
exports.getAddPlayerProfile = (req, res) => {
  const squadId = req.params.squadId;
  console.log(squadId); // checking the value of squadId is correct

  res.render("addPlayerProfile", { squadId });
};

// function to view the gameSetup page
exports.getGameSetup = async (req, res, next) => {
  try {
    // Fetch the squads associated with the current user
    const squads = await Squad.find({ user: req.user._id }).exec();

    // Fetch the player positions and other relevant data needed for the view
    const playerPositions = [
      "GK",
      "LB",
      "FB",
      "RB",
      "LWB",
      "CHB",
      "RWB",
      "MF1",
      "MF2",
      "LHF",
      "CHF",
      "RHF",
      "LCF",
      "FF",
      "RCF",
    ];

    // Fetch the gameSetup data based on the gamesetup ID (req.params.id)
    const gameSetup = await GameSetup.findById(req.params.id).exec();

    // Get the selected squad's players to populate the player dropdowns
    let players = [];
    if (gameSetup && gameSetup.selectedTeam) {
      // Fetch players by squad ID directly within the getGameSetup function
      players = await Player.find({ squad: gameSetup.selectedTeam }).exec();
    }

    res.render("gameSetup", {
      title: "Game Setup",
      squads,
      playerPositions,
      gameSetup,
      players,
    });
  } catch (err) {
    console.error("Error fetching game setup data:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
// function to view the recordGames
exports.getRecordGames = catchAsync(async (req, res) => {
  try {
    // Fetch the game setups from the database
    const gameSetups = await GameSetup.find().populate("playerSetup.playerId");

    res.render("recordGames", { gameSetups });
  } catch (error) {
    console.error("Error fetching game setups:", error);
    res
      .status(500)
      .render("error", { message: "Failed to fetch game setups." });
  }
});
// function to view the recordStats page
exports.getRecordStats = catchAsync(async (req, res) => {
  try {
    // Retrieve the game setup ID
    const { gameSetupId } = req.query;

    // Fetch the game setup data by its ID
    const gameSetupData = await fetchGameSetupById(gameSetupId);

    res.render("recordStats", {
      title: "Record Game Stats",
      gameSetupData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching game setup data" });
  }
});

// function for viewing game stats in the gameStats page
exports.viewGameSetups = async (req, res, next) => {
  try {
    // Fetch all game setups from your database
    const gameSetups = await GameSetup.find();

    res.render("viewStats", { gameSetups });
  } catch (err) {
    next(err);
  }
};

// This function handles the route that displays game statistics for a specific game setup.
exports.viewGameStats = async (req, res, next) => {
  try {
    const { gameSetupId } = req.params;

    // Fetch game stats for the provided gameSetupId
    const gameStats = await Stat.find({ gameSetup: gameSetupId }).populate(
      "player"
    );

    res.render("gameStats", { gameStats });
  } catch (err) {
    next(err);
  }
};
