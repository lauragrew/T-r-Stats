const catchAsync = require("../utils/catchAsync");
const Squad = require("../models/squadModel");
const Player = require("../models/playerModel");
const GameSetup = require("../models/gameSetupModel");
const { fetchGameSetupById } = require("../controllers/gameSetupController");

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

exports.getAddPlayerProfile = (req, res) => {
  const squadId = req.params.squadId; // Make sure the parameter name matches the one in the route
  console.log(squadId); // Add this line to check the value of squadId

  // Render the "addPlayerProfile" view with the squadId
  res.render("addPlayerProfile", { squadId });
};

// View controller - get game setup page
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

    // Fetch the gameSetup data based on the provided ID (req.params.id)
    const gameSetup = await GameSetup.findById(req.params.id).exec();

    // Get the selected squad's players to populate the player dropdowns
    let players = [];
    if (gameSetup && gameSetup.selectedTeam) {
      // Fetch players by squad ID directly within the getGameSetup function
      players = await Player.find({ squad: gameSetup.selectedTeam }).exec();
    }

    // Render the view with the data
    res.render("gameSetup", {
      title: "Game Setup",
      squads,
      playerPositions,
      gameSetup,
      players,
      // Other data to pass to the view if needed
    });
  } catch (err) {
    console.error("Error fetching game setup data:", err);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.getRecordGames = catchAsync(async (req, res) => {
  try {
    // Fetch the game setups from the database or wherever they are stored
    const gameSetups = await GameSetup.find().populate("playerSetup.playerId");

    res.render("recordGames", { gameSetups });
  } catch (error) {
    console.error("Error fetching game setups:", error);
    res
      .status(500)
      .render("error", { message: "Failed to fetch game setups." });
  }
});

// exports.getRecordStats = async (req, res, next) => {
//   try {
//     // Retrieve the game setup ID from the query parameter
//     const { gameSetupId } = req.query;

//     // Fetch the game setup data by its ID
//     const gameSetupData = await fetchGameSetupById(gameSetupId);

//     // Render the recordStats.pug page with the game setup data and stat types
//     res.render("recordStats", {
//       title: "Record Game Stats",
//       gameSetupData,
//     });
//   } catch (error) {
//     // Handle errors
//     next(error);
//   }
// };

exports.getRecordStats = catchAsync(async (req, res) => {
  try {
    // Retrieve the game setup ID from the query parameter
    const { gameSetupId } = req.query;

    // Fetch the game setup data by its ID
    const gameSetupData = await fetchGameSetupById(gameSetupId);

    // Render the recordStats.pug page with the game setup data and stat types
    res.render("recordStats", {
      title: "Record Game Stats",
      gameSetupData,
    });
  } catch (error) {
    // Handle errors
    console.log(error);
    res.status(500).json({ message: "Error fetching game setup data" });
  }
});
