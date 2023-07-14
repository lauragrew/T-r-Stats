const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const Team = require("../models/teamModel");
const mongoose = require("mongoose");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with this id!", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with this id!", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

// exports.createOne = (Model) =>
//   catchAsync(async (req, res, next) => {
//     const doc = await Model.create(req.body);

//     res.status(201).json({
//       status: "success",
//       data: {
//         data: doc,
//       },
//     });
//   });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    let doc;

    if (Model.modelName === "Team") {
      req.body.user = req.user._id;
      doc = await Model.create(req.body);
    } else if (Model.modelName === "Player") {
      // Check if the player should be associated with a team
      if (req.body.team) {
        // Convert the teamId to an ObjectId
        const teamId = mongoose.Types.ObjectId(req.body.team);

        // Create the player and associate it with the specified team
        doc = await Model.create({
          ...req.body,
          user: req.user._id,
          team: teamId,
        });

        // Update the associated team's 'players' array
        await Team.findByIdAndUpdate(teamId, {
          $push: { players: doc._id },
        });
      } else {
        // Create the player without association to a team
        doc = await Model.create({
          ...req.body,
          user: req.user._id,
        });
      }
    } else {
      doc = await Model.create(req.body);
    }

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) {
      // Add population for the 'user' and 'players' fields
      query = query.populate([
        { path: "user", select: "user_id name" },
        { path: "players" },
      ]);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with this id!", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

// exports.getAll = (Model) =>
//   catchAsync(async (req, res, next) => {
//     // to allow for nested GET REVIEWS ON TOUR (hack)
//     let filter = {};
//     if (req.params.tourId) filter = { tour: req.params.tourId };

//     const features = new APIFeatures(Model.find(filter), req.query)
//       .filter()
//       .sort()
//       .limitFields()
//       .pagination();
//     const doc = await features.query;
//     //const doc = await features.query.explain();

//     // SEND RESPONSE
//     res.status(200).json({
//       status: "success",
//       result: doc.length,
//       data: {
//         data: doc,
//       },
//     });
//   });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    // Check if the Model is Team or Player
    if (Model.modelName === "Team" || Model.modelName === "Player") {
      // Filter based on the logged-in user's ID
      filter = { user: req.user._id };
    }

    let query = Model.find(filter);

    // Populate the 'players' field in the teams
    if (Model.modelName === "Team") {
      query = query.populate({
        path: "players",
        select: "name",
      });
    }

    // Populate the 'team' field with 'name' in the players
    if (Model.modelName === "Player") {
      query = query
        .populate({
          path: "team",
          select: "name",
        })
        .populate({
          path: "user",
          select: "name",
        });
    }

    const doc = await query;

    res.status(200).json({
      status: "success",
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });
