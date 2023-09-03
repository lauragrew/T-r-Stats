const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");

async function createTestUser() {
  const testUser = {
    firstName: "Test",
    lastName: "User",
    email: "testuser@example.com",
    photo: "test.jpg",
    role: "user",
    password: "testpassword",
    passwordConfirm: "testpassword",
    active: true,
  };

  // Hash the password before saving
  testUser.password = await bcrypt.hash(testUser.password, 12);

  return await User.create(testUser);
}

module.exports = {
  createTestUser,
};
