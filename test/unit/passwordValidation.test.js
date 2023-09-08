const { expect } = require("chai");
const User = require("../../models/userModel");

// unit test - testing the correctPassword method of the User model for login.

describe("User Model", () => {
  describe("correctPassword", () => {
    it("should return true when the correct password is provided", async () => {
      // Add async here
      // Replace 'hashedPassword' with an actual hashed password from your database
      const hashedPassword =
        "$2a$12$k0mbEIe8coa08mPjfRSBt.6136he6huDcnx/OTT4TyP2QMPiXQJ/W";
      const user = new User({ password: hashedPassword });

      const isCorrect = await user.correctPassword(
        "testpassword",
        hashedPassword
      ); // Add await here
      expect(isCorrect).to.be.true;
    });

    it("should return false when an incorrect password is provided", async () => {
      // Add async here
      // Replace 'hashedPassword' with an actual hashed password from your database
      const hashedPassword =
        "$2a$12$k0mbEIe8coa08mPjfRSBt.6136he6huDcnx/OTT4TyP2QMPiXQJ/W";
      const user = new User({ password: hashedPassword });

      const isCorrect = await user.correctPassword(
        "incorrectPassword",
        hashedPassword
      ); // Add await here
      expect(isCorrect).to.be.false;
    });
  });
});
