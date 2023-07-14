const Team = require("../models/teamModel");
const factory = require("../controllers/handlerFactory");
const catchAsync = require("../utils/catchAsync");

// exports.getAllTeams = catchAsync(async (req, res, next) => {
//   const teams = await Team.find({ user: req.user._id }).populate({
//     path: "players",
//     select: "name",
//   });

//   res.status(200).json({
//     status: "success",
//     result: teams.length,
//     data: {
//       data: teams,
//     },
//   });
// });

exports.getAllTeams = factory.getAll(Team);
exports.getTeam = factory.getOne(Team);
exports.createTeam = factory.createOne(Team);
exports.deleteTeam = factory.deleteOne(Team);
exports.updateTeam = factory.updateOne(Team);
