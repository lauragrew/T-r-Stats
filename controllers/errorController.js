const AppError = require("../utils/appError");

// Error handling functions for specific types of errors

// Handle casting errors when invalid data is provided for a database field
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle duplicate field values in the database
const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}. Please use another value.`;
  return new AppError(message, 400);
};

// Handle validation errors from the database (e.g., missing required fields)
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;

  return new AppError(message, 400);
};

// Handle invalid JWT token errors
const handleJWTErrorDB = () =>
  new AppError("Invalid token. Please log in again!", 401);

// Handle expired JWT token errors
const handleJWTExpiredErrorDB = () =>
  new AppError("Your token has expired. Please log in again!", 401);

// Send detailed error response in development environment
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err.message,
    message: err.message,
    stack: err.stack, // Include the error stack trace for debugging
  });
};

// Send generic error response in production environment
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: Don't leak error details
  } else {
    // 1) Log error for debugging purposes
    console.error("ERROR 🔥", err);

    // 2) Send a generic error message to the client
    res.status(500).json({
      status: "error",
      message: "Something went very wrong",
    });
  }
};

// Main error handling middleware function
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Check the environment to determine how to handle the error
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res); // In development, send detailed error response
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    // Handle specific types of errors based on their names or codes
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === "ValidationError") error = handleValidationErrorDB(error);
    if (err.name === "JsonWebTokenError") error = handleJWTErrorDB();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredErrorDB();

    sendErrorProd(error, res); // In production, send generic error response
  }
};
