// controllers/recordStatsController.js
const RecordStats = require("../models/recordStats");

// Controller function to record a new game stat
exports.recordGameStat = async (req, res, next) => {
  try {
    const { gameSetupId, playerId, statType, value } = req.body;

    // Create a new record stats document
    const newRecordStat = new RecordStats({
      gameSetup: gameSetupId,
      player: playerId,
      statType,
      value,
    });

    // Save the record stats document to the database
    const savedRecordStat = await newRecordStat.save();

    res.status(201).json({ data: savedRecordStat });
  } catch (error) {
    next(error);
  }
};

// Controller function to fetch game stats for a specific game setup
exports.getGameStatsByGameSetup = async (req, res, next) => {
  try {
    const { gameSetupId } = req.query;

    // Fetch all record stats for the given game setup ID
    const recordStats = await RecordStats.find({
      gameSetup: gameSetupId,
    }).populate("player");

    res.status(200).json({ data: recordStats });
  } catch (error) {
    next(error);
  }
};
