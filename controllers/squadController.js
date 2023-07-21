const Squad = require("../models/squadModel");
const catchAsync = require("../utils/catchAsync");

exports.createSquad = catchAsync(async (req, res) => {
  const { name } = req.body;

  // Check if a squad with the same name already exists
  const existingSquad = await Squad.findOne({ name });
  if (existingSquad) {
    return res
      .status(400)
      .json({ error: "A squad with that name already exists" });
  }

  // Create a new squad
  const newSquad = await Squad.create({
    name,
    user: req.user._id, // Assuming you are storing the user ID in the req.user object after authentication
  });

  // Populate the user field with the actual user data (name and id)
  await newSquad.populate("user", "firstName lastName").execPopulate();
  res.redirect("/viewSquads");

  // res.status(201).json({
  //   status: "success",
  //   data: {
  //     squad: newSquad,
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

// Controller function to delete a squad by its ID
exports.deleteSquad = catchAsync(async (req, res) => {
  const squadId = req.params.id;

  const deletedSquad = await Squad.findByIdAndDelete(squadId);

  if (!deletedSquad) {
    return res.status(404).json({ error: "Squad not found" });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
