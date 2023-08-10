const GameSetup = require("../models/gameSetupModel");

async function saveStat(req, res) {
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
}

module.exports = {
  saveStat,
};
