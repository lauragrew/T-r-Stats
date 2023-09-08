const GameSetup = require("../models/gameSetupModel");
const catchAsync = require("../utils/catchAsync");

// Function to save a player's stat
exports.saveStat = catchAsync(async (req, res) => {
  // extract data from the req body
  const { gameSetupId, playerId, position, statType, date } = req.body;

  try {
    // find the game setup using its ID
    const gameSetup = await GameSetup.findById(gameSetupId);

    if (!gameSetup) {
      return res.status(404).json({ message: "Game setup not found." });
    }
    // find a playersetup with game setup that matches the playerID
    const playerSetup = gameSetup.playerSetup.find(
      (player) => player.playerId.toString() === playerId
    );

    if (!playerSetup) {
      return res.status(404).json({ message: "Player setup not found." });
    }
    // seacrh for specified stat type within the player stats.
    const stat = playerSetup.stats.find((s) => s.statType === statType);
    // if stat is found, increment the stat count
    if (stat) {
      stat.count += 1;
    } else {
      playerSetup.stats.push({ statType, count: 1 });
    }
    // after saving stats modify and save the gamesetup
    await gameSetup.save();
    // return success message to the user
    return res.status(200).json({
      message: "Stat saved successfully.",
      gameSetup: gameSetup,
    });
    // error message if required
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to save stat. Please try again." });
  }
});

// Function to view all game setups and their stats
exports.viewStats = catchAsync(async (req, res) => {
  try {
    // query database to get all the gamesetups
    const gameSetups = await GameSetup.find();
    // valid stat types defined in gamesetup schema under "playerSetup.stats.statType"
    const validStatTypes = GameSetup.schema.path(
      "playerSetup.stats.statType"
    ).enumValues;
    // render viewStats page and view the array of gamesetups and stat types
    res.render("viewStats", { gameSetups, statTypes: validStatTypes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// function to end a game and remove it from record games
exports.endGame = catchAsync(async (req, res) => {
  const { gameSetupId } = req.params;

  // get the current date and time
  const endDate = new Date();

  // update the game setup to mark it as ended and set the end date
  await GameSetup.findByIdAndUpdate(gameSetupId, { ended: true, endDate });

  // respond with success message to the user
  res.json({ success: true, message: "Game ended successfully." });
});

// Function to fetch a specific player's stats
exports.fetchPlayerStats = async (req, res) => {
  // get the player ID form the req params
  const playerId = req.params.playerId;

  try {
    // query database to get all the player setip document associated with the player ID
    const playerSetup = await PlayerSetup.findById(playerId);

    if (!playerSetup) {
      return res.status(404).json({ message: "Player setup not found." });
    }
    // if the player setup is found, extract the statTypes array and the statCount array
    const statTypes = playerSetup.stats.map((stat) => stat.statType);
    const statsCounts = playerSetup.stats.map((stat) => stat.count);
    // return both of the arrays in the response
    res.status(200).json({ statTypes, statsCounts });
  } catch (error) {
    console.error("Error fetching player's stats:", error);
    res.status(500).json({ message: "Failed to fetch player's stats." });
  }
};
