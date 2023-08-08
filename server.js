// Importing required modules
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Loading Environment Variables: The dotenv.config() method is used to load environment variables from the config.env file.
dotenv.config({ path: "./config.env" });

// Importing express app
const app = require("./app");

// Database connection setup
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// connecting to the mongoose database and success message
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"));

// Server setup and listening on port 3000 with message displayed
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// Unhandled rejection and uncaught exception handlers - logs errors
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION ... SHUTDOWN 🔥");
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT REJECTION ... SHUTDOWN 🔥");
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
