// Create a controller file for the player-related operations. Inside the controllers folder, create a new file called playerController.js. This file will contain functions to handle player-related operations such as creating a player, retrieving players, updating player details, etc.

const Player = require("../models/playerModel");
const factory = require("../controllers/handlerFactory");

exports.getAllPlayers = factory.getAll(Player);
exports.getPlayer = factory.getOne(Player);
exports.createPlayer = factory.createOne(Player);
exports.updatePlayer = factory.updateOne(Player);
exports.deletePlayer = factory.deleteOne(Player);
