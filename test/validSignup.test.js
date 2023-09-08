const axios = require("axios");
const assert = require("assert");

const apiUrl = "http://localhost:3000/api/v1/users/signup";
const signupData = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  password: "testpassword",
  passwordConfirm: "testpassword",
};

// Send a POST request to the signup endpoint
axios
  .post(apiUrl, signupData)
  .then((response) => {
    // Make assertions about the response
    assert.strictEqual(response.status, 201, "Expected status code 201");
    assert.strictEqual(
      response.data.status,
      "success",
      "Expected status to be success"
    );
    assert.ok(response.data.token, "Expected a token in the response");
    // Add more assertions as needed

    console.log("Signup test passed.");
  })
  .catch((error) => {
    console.error("Signup test failed:", error.message);
  });
