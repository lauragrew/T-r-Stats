const GameSetup = require("../models/gameSetupModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.saveGameSetup = catchAsync(async (req, res) => {
  try {
    console.log("Received request body:", req.body);

    const { oppositionName, gameDescription, selectedTeam, playerSetup } =
      req.body;

    console.log("Received playerSetup data:", playerSetup); // Log the playerSetup data

    // Convert the playerSetup data to JSON format if it's coming as a string from the frontend
    const parsedPlayerSetup = JSON.parse(playerSetup);

    // Capture the user's ID from the session or authentication token
    const userId = req.user._id; // Adjust this based on your authentication method

    // Create a new GameSetup object with the user's ID and parsed playerSetup data
    const gameSetup = new GameSetup({
      user: userId,
      oppositionName,
      gameDescription,
      selectedTeam,
      playerSetup: parsedPlayerSetup,
    });

    console.log("New GameSetup object:", gameSetup); // Log the gameSetup object before saving

    const savedGameSetup = await gameSetup.save();

    console.log("Saved GameSetup object:", savedGameSetup); // Log the savedGameSetup object

    // Redirect to the "recordGames" page after successful game setup creation
    res.redirect("/recordGames");
  } catch (error) {
    console.error("Error saving game setup:", error);
    res.status(500).render("error", { message: "Failed to save game setup." });
  }
});

// function to delete a game setup
exports.deleteGameSetup = catchAsync(async (req, res) => {
  const { gameSetupId } = req.params;
  console.log("Received gameSetupId:", gameSetupId);

  try {
    // Find the game setup by its ID
    const gameSetup = await GameSetup.findById(gameSetupId);

    if (!gameSetup) {
      console.log("Game setup not found:", gameSetupId);
      // If the game setup with the given ID is not found, return 404 Not Found
      return res.status(404).json({ message: "Game setup not found" });
    }

    // Delete the game setup from the database
    await gameSetup.remove();
    console.log("Game setup deleted:", gameSetupId);

    // Return a success message
    res.json({ message: "Game setup deleted successfully" });
  } catch (error) {
    console.error("Error deleting game setup:", error);
    // Return an error message with status code 500 Internal Server Error
    res
      .status(500)
      .json({ message: "Error deleting game setup. Please try again." });
  }
});

// function to fetch the gamesetup by its ID - used for getting recordStats page
exports.fetchGameSetupById = async (gameSetupId) => {
  try {
    const gameSetup = await GameSetup.findById(gameSetupId);
    return gameSetup;
  } catch (error) {
    throw new Error("Error fetching game setup data");
  }
};

// In your controller
exports.getGameSetupsByDateRange = async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const selectedTeamId = req.query.selectedTeam; // Get the selected team ID from query parameter

    const gameSetups = await GameSetup.find({
      ended: true,
      endDate: { $gte: startDate, $lte: endDate },
      selectedTeam: selectedTeamId, // Filter by selected team ID
    });

    res.status(200).json(gameSetups);
  } catch (error) {
    console.error("Error fetching game setups:", error);
    res.status(500).json({ error: "Failed to fetch game setups." });
  }
};
