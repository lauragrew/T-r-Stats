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

exports.getForgotPassword = async (req, res) => {
  res.render("forgotPassword", {
    title: "Tír Stats | Forgot Password",
  });
};

exports.getResetPassword = (req, res) => {
  const { token } = req.params;
  res.render("resetPassword", { resetToken: token });
};

exports.getAboutPage = async (req, res) => {
  res.render("about", {
    title: "Tír Stats | About",
  });
};

// function to view the dashboard page
exports.getDashboard = async (req, res) => {
  res.status(200).render("dashboard", {
    title: "Tír Stats | Dashboard",
  });
};

// // function to view the viewSquads page (const squads = await Squad.find({ user: req.user._id }) used to find the currently logged in user using the protect middlware req.user)
exports.getViewSquads = catchAsync(async (req, res) => {
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

  // dind the squad by ID
  const squad = await Squad.findById(id);

  if (!squad) {
    // error when the squad is not found
    return res.status(404).json({ error: "Squad not found" });
  }

  // find the players associated with the squad
  const players = await Player.find({ squad: id });

  // view the "viewPlayers" page and pass both squad and players data to it
  res.render("viewPlayers", { squad, players });
});

// function to view the createSquad page
exports.getCreateSquad = (req, res) => {
  res.render("createSquad");
};

// function to view the addPlayerProfile page
exports.getAddPlayerProfile = (req, res) => {
  const squadId = req.params.squadId;

  res.render("addPlayerProfile", { squadId });
};

// function to view the gameSetup page
exports.getGameSetup = async (req, res, next) => {
  try {
    // get the squads associated with the current user
    const squads = await Squad.find({ user: req.user._id }).exec();

    // get the player positions and other relevant data needed for the view
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

    // get the gameSetup data based on the gamesetup ID (req.params.id)
    const gameSetup = await GameSetup.findById(req.params.id).exec();

    // get the selected squad's players to populate the player dropdowns
    let players = [];
    if (gameSetup && gameSetup.selectedTeam) {
      // get players by squad ID directly within the getGameSetup function
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

// function to get the recordGame page
exports.getRecordGames = catchAsync(async (req, res) => {
  try {
    // get the game setups created by the logged-in user (protect middleware)
    const gameSetups = await GameSetup.find({ user: req.user._id }).populate(
      "playerSetup.playerId"
    );

    // get selected team names
    const selectedTeamNames = await Promise.all(
      gameSetups.map(async (setup) => {
        if (setup.selectedTeam) {
          const selectedTeam = await Squad.findById(setup.selectedTeam);
          return selectedTeam ? selectedTeam.name : null;
        }
        return null;
      })
    );

    // view the "recordGames" page with game setups and selected team names
    res.render("recordGames", { gameSetups, selectedTeamNames });
  } catch (error) {
    console.error("Error fetching game setups:", error);
    res
      .status(500)
      .render("error", { message: "Failed to fetch game setups." });
  }
});

// Function to view the recordStats page
exports.getRecordStats = catchAsync(async (req, res) => {
  try {
    // get the game setup ID
    const { gameSetupId } = req.query;

    // get the game setup data by its ID
    const gameSetupData = await fetchGameSetupById(gameSetupId);

    // get the selected team name
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

// Function for viewing game setups in the viewStats page
exports.viewStats = catchAsync(async (req, res) => {
  try {
    // get the game setups created by the logged-in user (protect middleware)
    const gameSetups = await GameSetup.find({ user: req.user._id });

    // get selected team names
    const selectedTeamNames = await Promise.all(
      gameSetups.map(async (setup) => {
        if (setup.selectedTeam) {
          const selectedTeam = await Squad.findById(setup.selectedTeam);
          return selectedTeam ? selectedTeam.name : null;
        }
        return null;
      })
    );

    // view the "viewStats" page with game setups and selected team names
    res.render("viewStats", { gameSetups, selectedTeamNames });
  } catch (error) {
    console.error("Error fetching game setups:", error);
    res
      .status(500)
      .render("error", { message: "Failed to fetch game setups." });
  }
});

// funciton to view the game stats page
exports.viewGameStats = catchAsync(async (req, res) => {
  const gameSetupId = req.params.gameSetupId;

  try {
    // get the game setup based on the provided ID
    const gameSetup = await GameSetup.findById(gameSetupId);

    if (!gameSetup) {
      return res.status(404).json({ message: "Game setup not found." });
    }

    // get selected team name (setup.selectedTeam object)
    let selectedTeamName = null;
    if (gameSetup.selectedTeam) {
      const selectedTeam = await Squad.findById(gameSetup.selectedTeam);
      selectedTeamName = selectedTeam ? selectedTeam.name : null;
    }

    // calculate totals for each stat type
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
      // add the game setup information here
      gameInfo: `${selectedTeamName} vs ${gameSetup.oppositionName}\n${gameSetup.gameDescription}`,
    });
  } catch (error) {
    console.error("Error fetching game setup:", error);
    res.status(500).render("error", { message: "Failed to fetch game setup." });
  }
});
// fucntion to view the individual player charts
exports.viewPlayerChart = async (req, res) => {
  const playerSetupId = req.params.playerSetupId;

  try {
    // get the player setup based on the provided ID
    const gameSetup = await GameSetup.findOne({
      "playerSetup._id": playerSetupId,
    });

    if (!gameSetup) {
      return res.status(404).json({ message: "Player setup not found." });
    }

    // find the player setup within the game setup
    const playerSetup = gameSetup.playerSetup.find((ps) =>
      ps._id.equals(playerSetupId)
    );

    if (!playerSetup) {
      return res.status(404).json({ message: "Player setup not found." });
    }

    // calculate chart data for the player's stats
    const statTypes = Array.from(
      new Set(playerSetup.stats.map((stat) => stat.statType))
    );

    const chartData = statTypes.map((statType) => {
      const playerStat = playerSetup.stats.find((s) => s.statType === statType);
      const count = playerStat ? playerStat.count : 0;
      return {
        label: statType,
        data: [count],
      };
    });

    // view the player chart page and pass chartData
    res.render("viewPlayerChart", { chartData, playerSetup });
  } catch (error) {
    console.error("Error fetching player setup:", error);
    res.status(500).json({ message: "Failed to fetch player setup." });
  }
};
// function th get player stats
exports.fetchPlayerStats = async (req, res) => {
  const playerSetupId = req.params.playerSetupId;

  try {
    const gameSetup = await GameSetup.findOne({
      "playerSetup._id": playerSetupId,
    });

    if (!gameSetup) {
      return res.status(404).json({ message: "Player setup not found." });
    }

    // find the player setup within the game setup
    const playerSetup = gameSetup.playerSetup.find((ps) =>
      ps._id.equals(playerSetupId)
    );

    if (!playerSetup) {
      return res.status(404).json({ message: "Player setup not found." });
    }

    // calculate chart data for the player's stats
    const statTypes = Array.from(
      new Set(playerSetup.stats.map((stat) => stat.statType))
    );

    const chartData = statTypes.map((statType) => {
      const playerStat = playerSetup.stats.find((s) => s.statType === statType);
      const count = playerStat ? playerStat.count : 0;
      return {
        label: statType,
        data: [count],
      };
    });

    res.json({ chartData });
  } catch (error) {
    console.error("Error fetching player stats:", error);
    res.status(500).json({ message: "Failed to fetch player stats." });
  }
};
// funciton to view the total stats chart
exports.viewTotalStatsChart = catchAsync(async (req, res) => {
  const gameSetupId = req.params.gameSetupId;

  try {
    // get the game setup based on the provided ID
    const gameSetup = await GameSetup.findById(gameSetupId);

    if (!gameSetup) {
      return res.status(404).json({ message: "Game setup not found." });
    }

    // calculate totals for each stat type
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

    // get selected team name (setup.selectedTeam object))
    let selectedTeamName = null;
    if (gameSetup.selectedTeam) {
      const selectedTeam = await Squad.findById(gameSetup.selectedTeam);
      selectedTeamName = selectedTeam ? selectedTeam.name : null;
    }

    // view the "viewTotalStatsChart" page with the statTotals data
    res.render("viewTotalStatsChart", {
      gameSetup,
      selectedTeamName,
      statTotals,
      statTypes,
    });
  } catch (error) {
    console.error("Error fetching game setup:", error);
    res.status(500).render("error", { message: "Failed to fetch game setup." });
  }
});

// function to view the stat trends
exports.viewStatTrends = catchAsync(async (req, res) => {
  try {
    // get the currently logged-in user
    const currentUser = res.locals.user;

    // get game setups that belong to the current user and have an end date
    const gameSetups = await GameSetup.find({
      user: currentUser._id, // user referenced in gamesetups
      ended: true,
      endDate: { $exists: true },
    });
    console.log(gameSetups);

    // get stat data for each game setup
    const gameSetupStats = gameSetups.map((setup) => {
      const totalStats = setup.playerSetup.reduce((acc, player) => {
        const playerTotalStats = player.stats.reduce((playerAcc, stat) => {
          const existingStat = playerAcc.find(
            (s) => s.statType === stat.statType
          );
          if (existingStat) {
            existingStat.count += stat.count;
          } else {
            playerAcc.push({ ...stat });
          }
          return playerAcc;
        }, []);
        return playerTotalStats;
      }, []);

      return {
        gameSetup: setup,
        totalStats: totalStats,
      };
    });
    // view the stat trends page
    res.render("viewStatTrends", {
      title: "Stat Trends",
      gameSetupStats,
    });
  } catch (error) {
    console.error("Error fetching game setups:", error);
    res
      .status(500)
      .render("error", { message: "Failed to fetch game setups." });
  }
});

// function to view the profile Page
exports.getProfilePage = catchAsync(async (req, res) => {
  res.render("profile", { user: req.user });
});

// function to view the update Password Page
exports.getUpdatePassword = catchAsync(async (req, res) => {
  res.render("updatePassword", { user: req.user });
});

// function to view the instruction page
exports.getInstruction = (req, res) => {
  res.status(200).render("instructions", {
    title: "Tír Stats | Instructions ",
  });
};
