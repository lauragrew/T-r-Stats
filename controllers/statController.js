const GameSetup = require("../models/gameSetupModel");
const Squad = require("../models/squadModel");
const Player = require("../models/playerModel");
const Stat = require("../models/statModel");

// function to fetch the gamesetup and squad IDs
exports.fetchGameSetupAndSquadIds = async (req, res) => {
  try {
    const { gameSetupId } = req.query;

    // Fetch the GameSetup document from the database
    const gameSetup = await GameSetup.findById(gameSetupId);

    // Get the Squad ID from the GameSetup document
    const squadId = gameSetup.selectedTeam; // the selectedTeam here is the Squad ID

    res.status(200).json({ gameSetupId, squadId });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data." });
  }
};

exports.saveStat = async (req, res) => {
  try {
    const { gameSetupId, playerId, squadId, statType } = req.body;

    // Create a new Stat document and save it to the database
    const newStat = await Stat.create({
      gameSetup: gameSetupId,
      player: playerId,
      squad: squadId,
      statType,
    });

    // success or error message
    res.status(201).json({
      status: "success",
      data: {
        stat: newStat,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to save stat." });
  }
};
