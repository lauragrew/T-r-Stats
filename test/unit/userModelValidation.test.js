const { expect } = require("chai");
const User = require("../../models/userModel");

describe("User Model Validation Tests", () => {
  it("should not allow a user to be created without a first name", async () => {
    try {
      const user = new User({
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "password123",
        passwordConfirm: "password123",
      });
      await user.validate();
      throw new Error("Validation should have failed.");
    } catch (err) {
      expect(err.errors.firstName.message).to.equal(
        "Please enter your first name"
      );
    }
  });

  it("should not allow a user to be created without a last name", async () => {
    try {
      const user = new User({
        firstName: "John",
        email: "johndoe@example.com",
        password: "password123",
        passwordConfirm: "password123",
      });
      await user.validate();
      throw new Error("Validation should have failed.");
    } catch (err) {
      expect(err.errors.lastName.message).to.equal(
        "Please enter your last name"
      );
    }
  });

  it("should not allow a user to be created with an invalid email", async () => {
    try {
      const user = new User({
        firstName: "John",
        lastName: "Doe",
        email: "invalid-email",
        password: "password123",
        passwordConfirm: "password123",
      });
      await user.validate();
      throw new Error("Validation should have failed.");
    } catch (err) {
      expect(err.errors.email.message).to.equal("Please enter a valid email");
    }
  });

  it("should not allow a user to be created with a short password", async () => {
    try {
      const user = new User({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "12345", // Password is too short
        passwordConfirm: "12345",
      });
      await user.validate();
      throw new Error("Validation should have failed.");
    } catch (err) {
      expect(err.errors.password.message).to.equal(
        "Path `password` (`12345`) is shorter than the minimum allowed length (8)."
      );
    }
  });

  it("should not allow a user to be created with non-matching passwords", async () => {
    try {
      const user = new User({
        firstName: "John",
        lastName: "Doe",
        email: "johndoe@example.com",
        password: "password123",
        passwordConfirm: "password456", // Passwords don't match
      });
      await user.validate();
      throw new Error("Validation should have failed.");
    } catch (err) {
      expect(err.errors.passwordConfirm.message).to.equal(
        "Passwords are not the same"
      );
    }
  });
});
