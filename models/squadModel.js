// models/squadModel.js
const mongoose = require("mongoose");

const squadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A squad must have a name"],
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "A squad must be associated with a user"],
  },
});

const Squad = mongoose.model("Squad", squadSchema);

module.exports = Squad;
