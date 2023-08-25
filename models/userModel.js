const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true, // email cant be used again to signup
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "admin", "coach"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREAT OR SAVE!! (user.Create or user.Save) -
      // This function compares the value of the passwordConfirm field (el) element with the value of the actual password (this.password). If they match, the validation passes. If they don't match, the validation fails.
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

// pre-save middleware function defined on the userSchema. This middleware function is executed before a new user document is saved or an existing user document is updated in the database. It performs actions on the user data before saving it.

// This middleware function ensures that the user's password is hashed before it's saved to the database and clears the passwordConfirm field to prevent storing the confirmation password. Important so plain text passows are not stored.
userSchema.pre("save", async function (next) {
  // only run this if the password has been modified
  if (!this.isModified("password")) return next();
  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

// this middleware ensures that the passwordChangedAt field is updated when a user changes their password or when a new user is created.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// instance method - to compare passwords as one is hashed and one isnt so no way of comparing
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// this function is used to enhance security by checking if a user's password has been changed after a JWT was issued, and potentially invalidating the JWT if the password has been updated.
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  // false means not changed
  return false;
};

// this function generates a random token, hashes it, stores it along with an expiration timestamp, and returns the original token. It's an important part of the password reset process to ensure security and validity of the reset token.
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
