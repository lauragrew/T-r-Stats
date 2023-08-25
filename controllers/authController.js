const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

// function to call the signToken function with a user's ID, generate a JWT with the user's ID, signs it using the secret key, and sets an expiration time for the token. The JWT can then be sent to the user and used for authentication
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// function to create and send a JWT token
const createSendToken = (user, statusCode, res, redirectUrl) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  // set the JWT token as a cookie
  res.cookie("jwt", token, cookieOptions);

  // hide the password from the user before sending the response
  user.password = undefined;

  // send the response with the token and user data
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
      redirectUrl: redirectUrl,
    },
  });
};

// signup function
// exports.signup = catchAsync(async (req, res, next) => {
//   const { firstName, lastName, email, password, passwordConfirm } = req.body;
//   // check if the passwords match
//   if (password !== passwordConfirm) {
//     return res.status(400).json({
//       status: "error",
//       error: "Passwords do not match",
//     });
//   }

//   try {
//     // create a new user in the database
//     const newUser = await User.create({
//       firstName,
//       lastName,
//       email,
//       password,
//       passwordConfirm,
//     });
//     // create and send the JWT token
//     createSendToken(newUser, 201, res, "/dashboard");
//   } catch (err) {
//     // Pass the error message to the frontend if one occurs
//     const errorMessages = err.message.split(":");
//     const errorMessage = errorMessages[errorMessages.length - 1].trim();

//     res.status(400).json({
//       status: "error",
//       error: errorMessage,
//     });
//   }
// });

exports.signup = catchAsync(async (req, res, next) => {
  const { firstName, lastName, email, password, passwordConfirm } = req.body;

  // Check if the passwords match
  if (password !== passwordConfirm) {
    return res.status(400).json({
      status: "error",
      error: "Passwords do not match",
    });
  }

  try {
    // Create a new user in the database
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      passwordConfirm,
    });

    // Create and send the JWT token
    createSendToken(newUser, 201, res, "/dashboard");
  } catch (err) {
    // Check if the error is due to duplicate email
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(400).json({
        status: "error",
        error: "Email address is already in use",
      });
    }

    // For other errors, send a generic error message
    res.status(400).json({
      status: "error",
      error: "An error occurred during signup",
    });
  }
});

// login function
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide an email and password", 400));
  }
  // 2) Check if user exists & password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // 3) If user exists & password is correct, create and send a token back to the client
  createSendToken(user, 200, res, "/dashboard");
});

// logout function
exports.logout = (req, res) => {
  // Clear the JWT token cookie to log the user out
  res.cookie("jwt", "logged out", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success", redirectUrl: "/statsLogin" });
};

// middleware function for protecting routes - user must be logged in to access certain routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // if there is no token return an error
  if (!token) {
    return res.redirect("/statsLogin");
  }
  // 2) Verification of token - if someone has manipulated the token or is has expired
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) if verifcation is successful, check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists", 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again", 401)
    );
  }
  // grant access to the protected route
  req.user = currentUser;
  next();
});

// function to check if user is already logged in
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verifies token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      // 2) Check if user still exists (no errors)
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }
      // There is a logged in user
      console.log("Authenticated User:", currentUser);
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// function to restrict access based on user roles (admin - can only perform certain actions on the app)
// could be used if there is an admin role or lead coach and other coaches sign up as users. only the admin or lead coach can delete other users for example or do certain funtions
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles is an array in the userModel ['user', 'coach'] role = user
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };

// function for forget password
exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with that email", 404));
  }
  // 2) Generate random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) Send email with token
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Your reset token is: ${resetURL}\nPlease copy and paste this token on the reset password page.\nIf you didn't forget your password, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email, please copy & paste the URL",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError("There was an error sending the email, try again later", 500)
    );
  }
});

// function to reset password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired and there is a user, set the new password
  if (!user) {
    return next(
      new AppError("Password reset token is invalid or has expired", 400)
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) update the changedPasswordAt property of the user

  // 4) log the user in , sent JWT
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Verify token from the request header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  try {
    // Logging the received token
    console.log("Received Token:", token);

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Payload:", decoded);

    // Find the user by ID and select the password field
    const user = await User.findById(decoded.id).select("+password");

    // Check if the current password provided in the request is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("Current password is incorrect", 401));
    }

    // Update the password and passwordConfirm fields
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;

    // Save the user document
    await user.save();

    // Log the user in and send a JWT token
    createSendToken(user, 200, res); // Replace with your logic to send JWT token
  } catch (err) {
    // Logging token verification error
    console.error("Token Verification Error:", err);
    return next(new AppError("Token is invalid or has expired", 400));
  }
});
