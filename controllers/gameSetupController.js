const GameSetup = require("../models/gameSetupModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// function to save a gamesetup
exports.saveGameSetup = catchAsync(async (req, res) => {
  try {
    const { oppositionName, gameDescription, selectedTeam, playerSetup } =
      req.body;

    // Convert the playerSetup data to JSON format if it's coming as a string from the frontend
    const parsedPlayerSetup = JSON.parse(playerSetup);

    // Capture the user's ID from the JWT
    const userId = req.user._id;

    // Create a new gamesetup
    const gameSetup = new GameSetup({
      user: userId,
      oppositionName,
      gameDescription,
      selectedTeam,
      playerSetup: parsedPlayerSetup,
    });

    const savedGameSetup = await gameSetup.save();

    // Redirect to the "recordGames" page after successful game setup creation
    res.redirect("/recordGames");
  } catch (error) {
    console.error("Error saving game setup:", error);
    res.status(500).render("error", { message: "Failed to save game setup." });
  }
});

// function to delete a gamesetup
exports.deleteGameSetup = catchAsync(async (req, res) => {
  const { gameSetupId } = req.params;

  try {
    // Find the game setup by its ID
    const gameSetup = await GameSetup.findById(gameSetupId);

    if (!gameSetup) {
      console.log("Game setup not found:", gameSetupId);
      // If the game setup with the given ID is not found, return error
      return res.status(404).json({ message: "Game setup not found" });
    }

    // Delete the game setup from the database
    await gameSetup.remove();

    // Return a success message to the user
    res.json({ message: "Game setup deleted successfully" });
  } catch (error) {
    console.error("Error deleting game setup:", error);

    res
      .status(500)
      .json({ message: "Error deleting game setup. Please try again." });
  }
});

// function to fetch the gamesetup by its ID - used for getting gamesetups for recordStats and veiw stats page
exports.fetchGameSetupById = async (gameSetupId) => {
  try {
    const gameSetup = await GameSetup.findById(gameSetupId);
    return gameSetup;
  } catch (error) {
    throw new Error("Error fetching game setup data");
  }
};

// fucntion to get gamesetups by date range for viewing stat trends
exports.getGameSetupsByDateRange = async (req, res) => {
  try {
    // choose start date, end date and team
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const selectedTeamId = req.query.selectedTeam;
    // only get game setups that have ended and have an end date
    const gameSetups = await GameSetup.find({
      ended: true,
      endDate: { $gte: startDate, $lte: endDate },
      selectedTeam: selectedTeamId,
    });
    // display error message
    res.status(200).json(gameSetups);
  } catch (error) {
    console.error("Error fetching game setups:", error);
    res.status(500).json({ error: "Failed to fetch game setups." });
  }
};
