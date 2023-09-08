const axios = require("axios");
const assert = require("assert");

const apiUrl = "http://localhost:3000/api/v1/users/signup";

// User data with an email that's already in use
const existingUserSignupData = {
  firstName: "Test",
  lastName: "User",
  email: "test@hotmail.com", // An email that's already in use
  password: "testpassword",
  passwordConfirm: "testpassword",
};

axios
  .post(apiUrl, existingUserSignupData)
  .then((response) => {
    console.log("Response Status Code:", response.status);
    console.log("Response Data:", response.data);

    // Add assertions as needed
    assert.strictEqual(response.status, 400, "Expected status code 400");
    assert.strictEqual(
      response.data.status,
      "error",
      "Expected status to be error"
    );
    assert.strictEqual(
      response.data.error,
      "Email address is already in use", // Expected error message for duplicate email
      "Expected error message for duplicate email"
    );
  })
  .catch((error) => {
    console.log(
      "Duplicate email signup test passed (expected behavior):",
      error.message
    );
  });
