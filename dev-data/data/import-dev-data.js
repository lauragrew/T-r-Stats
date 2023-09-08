const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Player = require("../../models/tourModel");
const User = require("../../models/userModel");
const Squad = require("../../models/reviewModel");

// file for bulk adding users, players or squads if required (didnt really use this in the end as most data was added thorugh user input)

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

// connecting to the database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("DB connection successful"));

//read json file
const squads = JSON.parse(fs.readFileSync(`${__dirname}/squads.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const players = JSON.parse(
  fs.readFileSync(`${__dirname}/players.json`, "utf-8")
);

// import data into database
const importData = async () => {
  try {
    await Squad.create(squads);
    await User.create(users, { validateBeforeSave: false });
    await Player.create(players);
    console.log("Data imported successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// delete all data from collection
const deleteData = async () => {
  try {
    await Squad.deleteMany();
    await User.deleteMany();
    await Player.deleteMany();
    console.log("Data deleted successfully");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

console.log(process.argv);

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
