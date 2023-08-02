const Squad = require("../models/squadModel");
const catchAsync = require("../utils/catchAsync");

exports.createSquad = catchAsync(async (req, res) => {
  const { name } = req.body;

  // Check if a squad with the same name already exists but is owned by another user
  const existingSquad = await Squad.findOne({
    name,
    user: { $ne: req.user._id },
  });
  if (existingSquad) {
    // A squad with the same name exists but is owned by another user
    // You can choose to display an error message or take appropriate action
    return res.status(400).json({
      error: "A squad with that name already exists for another user",
    });
  }

  // Create a new squad
  const newSquad = await Squad.create({
    name,
    user: req.user._id, // Assuming you are storing the user ID in the req.user object after authentication
  });

  // Populate the user field with the actual user data (name and id)
  await newSquad.populate("user", "firstName lastName").execPopulate();
  res.redirect("/viewSquads");
});

// Controller function to get all squads created by the logged-in user
exports.getAllUserSquads = catchAsync(async (req, res) => {
  // Get all squads created by the logged-in user (using user ID)
  const squads = await Squad.find({ user: req.user._id }).populate(
    "user",
    "firstName lastName"
  );

  res.status(200).json({
    status: "success",
    data: {
      squads,
    },
  });
});

// Controller function to get a single squad by its ID
exports.getSquadById = catchAsync(async (req, res) => {
  const squadId = req.params.id;

  const squad = await Squad.findById(squadId).populate(
    "user",
    "firstName lastName"
  );

  if (!squad) {
    return res.status(404).json({ error: "Squad not found" });
  }

  res.status(200).json({
    status: "success",
    data: {
      squad,
    },
  });
});

// Controller function to update a squad by its ID
exports.updateSquad = catchAsync(async (req, res) => {
  const squadId = req.params.id;
  const { name } = req.body;

  const updatedSquad = await Squad.findByIdAndUpdate(
    squadId,
    { name },
    { new: true, runValidators: true }
  );

  if (!updatedSquad) {
    return res.status(404).json({ error: "Squad not found" });
  }

  res.status(200).json({
    status: "success",
    data: {
      squad: updatedSquad,
    },
  });
});

// Function to delete a squad by ID
exports.deleteSquad = async (req, res, next) => {
  try {
    console.log("Delete Squad function called");
    const squadId = req.params.squadId;

    // Implement your logic to delete the squad from the database
    // For example, using Mongoose:
    await Squad.findByIdAndDelete(squadId);

    // Respond with a success message
    res.status(200).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    // Handle errors
    next(error);
  }
};
