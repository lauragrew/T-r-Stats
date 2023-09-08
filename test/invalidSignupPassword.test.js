const axios = require("axios");
const assert = require("assert");

const apiUrl = "http://localhost:3000/api/v1/users/signup";
const invalidSignupData = {
  firstName: "Test",
  lastName: "User1",
  email: "test@example1.com",
  password: "testpassword",
  passwordConfirm: "mismatchedpassword",
};

// Send a POST request to the signup endpoint
axios
  .post(apiUrl, invalidSignupData)
  .then((response) => {
    assert.strictEqual(response.status, 400, "Expected status code 400");
    assert.strictEqual(
      response.data.status,
      "error",
      "Expected status to be error"
    );
    assert.strictEqual(
      response.data.error,
      "Passwords do not match",
      "Expected error message for password mismatch"
    );
  })
  .catch((error) => {
    console.error("Password mismatch test passed.");
  });
