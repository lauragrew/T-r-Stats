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

    // Fetch selected team names
    const selectedTeamNames = await Promise.all(
      gameSetups.map(async (setup) => {
        if (setup.selectedTeam) {
          const selectedTeam = await Squad.findById(setup.selectedTeam);
          return selectedTeam ? selectedTeam.name : null;
        }
        return null;
      })
    );

    // Render the "recordGames" template with game setups and selected team names
    res.render("recordGames", { gameSetups, selectedTeamNames });
  } catch (error) {
    console.error("Error fetching game setups:", error);
    res
      .status(500)
      .render("error", { message: "Failed to fetch game setups." });
  }
});

// function to view the recordStats page
// exports.getRecordStats = catchAsync(async (req, res) => {
//   try {
//     // Retrieve the game setup ID
//     const { gameSetupId } = req.query;

//     // Fetch the game setup data by its ID
//     const gameSetupData = await fetchGameSetupById(gameSetupId);

//     res.render("recordStats", {
//       title: "Record Game Stats",
//       gameSetupData,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Error fetching game setup data" });
//   }
// });

// Function to view the recordStats page
exports.getRecordStats = catchAsync(async (req, res) => {
  try {
    // Retrieve the game setup ID
    const { gameSetupId } = req.query;

    // Fetch the game setup data by its ID
    const gameSetupData = await fetchGameSetupById(gameSetupId);

    // Fetch the selected team name
    const selectedTeam = await Squad.findById(gameSetupData.selectedTeam);
    const selectedTeamName = selectedTeam ? selectedTeam.name : "";

    res.render("recordStats", {
      title: "Record Game Stats",
      gameSetupData,
      selectedTeamName,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching game setup data" });
  }
});

// function for viewing game setups in the viewStats page
exports.viewStats = catchAsync(async (req, res) => {
  try {
    // Fetch the game setups from the database
    const gameSetups = await GameSetup.find();

    // Fetch selected team names
    const selectedTeamNames = await Promise.all(
      gameSetups.map(async (setup) => {
        if (setup.selectedTeam) {
          const selectedTeam = await Squad.findById(setup.selectedTeam);
          return selectedTeam ? selectedTeam.name : null;
        }
        return null;
      })
    );

    // Render the "viewStats" template with game setups and selected team names
    res.render("viewStats", { gameSetups, selectedTeamNames });
  } catch (error) {
    console.error("Error fetching game setups:", error);
    res
      .status(500)
      .render("error", { message: "Failed to fetch game setups." });
  }
});

exports.viewGameStats = catchAsync(async (req, res) => {
  const gameSetupId = req.params.gameSetupId;

  try {
    // Fetch the game setup based on the provided ID
    const gameSetup = await GameSetup.findById(gameSetupId);

    if (!gameSetup) {
      return res.status(404).json({ message: "Game setup not found." });
    }

    // Fetch selected team name (assuming setup.selectedTeam is an ObjectId)
    let selectedTeamName = null;
    if (gameSetup.selectedTeam) {
      const selectedTeam = await Squad.findById(gameSetup.selectedTeam);
      selectedTeamName = selectedTeam ? selectedTeam.name : null;
    }

    // Calculate totals for each stat type
    const statTypes = Array.from(
      new Set(
        gameSetup.playerSetup.flatMap((playerSetup) =>
          playerSetup.stats.map((stat) => stat.statType)
        )
      )
    );
    const statTotals = statTypes.map((statType) => {
      return gameSetup.playerSetup.reduce((acc, playerSetup) => {
        const playerStat = playerSetup.stats.find(
          (s) => s.statType === statType
        );
        return acc + (playerStat ? playerStat.count : 0);
      }, 0);
    });

    // view the "viewGameStats" page with the game setup data, selected team name, and stat totals
    res.render("viewGameStats", {
      gameSetup,
      selectedTeamName,
      statTypes,
      statTotals,
    });
  } catch (error) {
    console.error("Error fetching game setup:", error);
    res.status(500).render("error", { message: "Failed to fetch game setup." });
  }
});

exports.viewPlayerChart = async (req, res) => {
  const playerSetupId = req.params.playerSetupId;

  try {
    // Fetch the player setup based on the provided ID
    const gameSetup = await GameSetup.findOne({
      "playerSetup._id": playerSetupId,
    });

    if (!gameSetup) {
      return res.status(404).json({ message: "Player setup not found." });
    }

    // Find the player setup within the game setup
    const playerSetup = gameSetup.playerSetup.find((ps) =>
      ps._id.equals(playerSetupId)
    );

    if (!playerSetup) {
      return res.status(404).json({ message: "Player setup not found." });
    }

    // Calculate chart data for the player's stats
    const statTypes = Array.from(
      new Set(playerSetup.stats.map((stat) => stat.statType))
    );

    const chartData = statTypes.map((statType) => {
      const playerStat = playerSetup.stats.find((s) => s.statType === statType);
      const count = playerStat ? playerStat.count : 0;
      return {
        label: statType,
        data: [count], // For a single player, there's only one data point per stat type
      };
    });

    // Render the Pug template and pass chartData as a local variable
    res.render("viewPlayerChart", { chartData, playerSetup }); // Make sure "viewPlayerChart" is the correct Pug template name
    // Make sure "viewPlayerChart" is the correct Pug template name
  } catch (error) {
    console.error("Error fetching player setup:", error);
    res.status(500).json({ message: "Failed to fetch player setup." });
  }
};

exports.fetchPlayerStats = async (req, res) => {
  const playerSetupId = req.params.playerSetupId;

  try {
    const gameSetup = await GameSetup.findOne({
      "playerSetup._id": playerSetupId,
    });

    if (!gameSetup) {
      return res.status(404).json({ message: "Player setup not found." });
    }

    // Find the player setup within the game setup
    const playerSetup = gameSetup.playerSetup.find((ps) =>
      ps._id.equals(playerSetupId)
    );

    if (!playerSetup) {
      return res.status(404).json({ message: "Player setup not found." });
    }

    // Calculate chart data for the player's stats
    const statTypes = Array.from(
      new Set(playerSetup.stats.map((stat) => stat.statType))
    );

    const chartData = statTypes.map((statType) => {
      const playerStat = playerSetup.stats.find((s) => s.statType === statType);
      const count = playerStat ? playerStat.count : 0;
      return {
        label: statType,
        data: [count], // For a single player, there's only one data point per stat type
      };
    });

    res.json({ chartData });
  } catch (error) {
    console.error("Error fetching player stats:", error);
    res.status(500).json({ message: "Failed to fetch player stats." });
  }
};

exports.viewTotalStatsChart = catchAsync(async (req, res) => {
  const gameSetupId = req.params.gameSetupId;

  try {
    // Fetch the game setup based on the provided ID
    const gameSetup = await GameSetup.findById(gameSetupId);

    if (!gameSetup) {
      return res.status(404).json({ message: "Game setup not found." });
    }

    // Calculate totals for each stat type
    const statTypes = Array.from(
      new Set(
        gameSetup.playerSetup.flatMap((playerSetup) =>
          playerSetup.stats.map((stat) => stat.statType)
        )
      )
    );
    const statTotals = statTypes.map((statType) => {
      return gameSetup.playerSetup.reduce((acc, playerSetup) => {
        const playerStat = playerSetup.stats.find(
          (s) => s.statType === statType
        );
        return acc + (playerStat ? playerStat.count : 0);
      }, 0);
    });

    // Fetch selected team name (assuming setup.selectedTeam is an ObjectId)
    let selectedTeamName = null;
    if (gameSetup.selectedTeam) {
      const selectedTeam = await Squad.findById(gameSetup.selectedTeam);
      selectedTeamName = selectedTeam ? selectedTeam.name : null;
    }

    // Render the "viewTotalStatsChart" page with the statTotals data
    res.render("viewTotalStatsChart", {
      gameSetup, // Pass the gameSetup data
      selectedTeamName, // Replace with the actual selected team name
      statTotals,
      statTypes,
    });
  } catch (error) {
    console.error("Error fetching game setup:", error);
    res.status(500).render("error", { message: "Failed to fetch game setup." });
  }
});
