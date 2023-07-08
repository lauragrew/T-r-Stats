const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) get tour data from collection
  const tours = await Tour.find();

  // 2) Build template

  // 3) Render that template using the tour data from step 1

  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
};

// MY APP

exports.getStatsMain = (req, res) => {
  res.status(200).render("statsMain", {
    title: "Tír Stats",
  });
};

exports.getStatsSignup = (req, res) => {
  res.status(200).render("statsSignup", {
    title: "Tír Stats | Signup ",
  });
};

exports.getStatsSignup1 = (req, res) => {
  res.status(200).render("statsSignup1", {
    title: "Tír Stats | Signup ",
  });
};

exports.getStatsLogin = (req, res) => {
  res.status(200).render("statsLogin", {
    title: "Tír Stats | Login",
  });
};

// this is the routes with catch async *********

// exports.getStatsMain = catchAsync(async (req, res, next) => {
//   res.status(200).render("statsMain", {
//     title: "Tír Stats",
//   });
// });

// exports.getStatsSignup = catchAsync(async (req, res, next) => {
//   res.status(200).render("statsSignup", {
//     title: "Tír Stats | Signup ",
//   });
// });
