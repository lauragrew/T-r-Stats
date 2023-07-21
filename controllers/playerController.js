// controllers/playerController.js
const Player = require("../models/playerModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Squad = require("../models/squadModel");
const multer = require("multer");

// Define storage for the uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set the destination folder where the uploaded files will be stored
    cb(null, "public/uploads/"); // Change the folder path as needed
  },
  filename: function (req, file, cb) {
    // Set the file name for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Create the multer middleware
const upload = multer({ storage: storage });

// Now you can use the "upload" middleware in the createPlayer route

exports.createPlayer = [
  // Use the "upload" middleware here to handle file upload
  upload.single("photo"),

  async (req, res) => {
    try {
      // Extract the player details from the request body
      const { firstName, lastName } = req.body;
      // Get the squad ID from the request params
      const squadId = req.params.squadId;
      // Get the user ID of the currently logged-in user (you may have this in the session or token)
      const userId = req.user._id;

      // Get the file name from the uploaded file (if multer is configured correctly)
      const photo = req.file ? req.file.filename : undefined;

      // Create the player and associate it with the squad and user
      const player = await Player.create({
        firstName,
        lastName,
        photo,
        squad: squadId,
        user: userId,
      });

      // Set a flash success message
      req.flash("success", "Player created successfully!");

      // Redirect the user back to the "viewPlayers" page for the squad (squadId)
      return res.redirect(`/viewPlayers/${squadId}`);
    } catch (err) {
      // Handle any errors that occur during player creation
      return res.status(500).json({
        status: "error",
        message: "Failed to create player",
        error: err.message,
      });
    }
  },
];
