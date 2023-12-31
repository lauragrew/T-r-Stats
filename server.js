// imports and environment variables

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
dotenv.config({ path: "./test.env" });

const app = require("./app");

let DB = process.env.DATABASE; // default to main database URI
console.log("Using development database");
if (process.env.NODE_ENV === "test") {
  console.log("Running in TEST environment");
  DB = process.env.TEST_DB_URI; // use test database URI for testing
}

// if the database URI contains <PASSWORD>, replace it with the actual password
DB = DB.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

console.log("Environment:", process.env.NODE_ENV);
console.log("Database URI:", DB);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful"));

// set the PORT variable based on the environment
const port =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_PORT
    : process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
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
