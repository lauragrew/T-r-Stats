const GameSetup = require("../models/gameSetupModel");
const catchAsync = require("../utils/catchAsync");

// Function to save a player's stat
exports.saveStat = catchAsync(async (req, res) => {
  const { gameSetupId, playerId, position, statType } = req.body;

  try {
    const gameSetup = await GameSetup.findById(gameSetupId);

    if (!gameSetup) {
      return res.status(404).json({ message: "Game setup not found." });
    }

    const playerSetup = gameSetup.playerSetup.find(
      (player) => player.playerId.toString() === playerId
    );

    if (!playerSetup) {
      return res.status(404).json({ message: "Player setup not found." });
    }

    const stat = playerSetup.stats.find((s) => s.statType === statType);

    if (stat) {
      stat.count += 1;
    } else {
      playerSetup.stats.push({ statType, count: 1 });
    }

    await gameSetup.save();

    return res.status(200).json({
      message: "Stat saved successfully.",
      gameSetup: gameSetup, // Include the updated gameSetup
    });
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
    const gameSetups = await GameSetup.find();
    const validStatTypes = GameSetup.schema.path(
      "playerSetup.stats.statType"
    ).enumValues;

    res.render("viewStats", { gameSetups, statTypes: validStatTypes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// function to end a game
exports.endGame = catchAsync(async (req, res) => {
  const { gameSetupId } = req.params;

  // Update the game setup to mark it as ended
  await GameSetup.findByIdAndUpdate(gameSetupId, { ended: true });

  console.log(`Game setup ${gameSetupId} marked as ended.`); // Add this line

  // Respond with success
  res.json({ success: true, message: "Game ended successfully." });
});
