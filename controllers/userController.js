const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("../controllers/handlerFactory");

// userController has functions for regular users or admin. for example if allows users to do things with their account but it also allows adming to do things with users accounts
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// middlreware using allow a user to view thier profile
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// update user profile info but not their password - used for admin for example
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) create error if user updates password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }

  // 2) filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, ["name", "email"]);

  // 3) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
// used to deactivate a users account by setting active to false
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// from the handler factory
// gets one user by ID
exports.getUser = factory.getOne(User);
// gets all users
exports.getAllUsers = factory.getAll(User);
// only for admin - dont attempt to update passwords with this
// updates a user by ID
exports.updateUser = factory.updateOne(User);
// deletes a user by ID
exports.deleteUser = factory.deleteOne(User);
