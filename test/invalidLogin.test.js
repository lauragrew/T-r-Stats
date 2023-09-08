const axios = require("axios");
const assert = require("assert");

const apiUrl = "http://localhost:3000/api/v1/users/login";

// Invalid login data with incorrect password
const invalidLoginData = {
  email: "test@hotmail.com",
  password: "invalidpassword",
};

axios
  .post(apiUrl, invalidLoginData)
  .then((response) => {
    // This should not be successful
    assert.strictEqual(response.status, 401, "Expected status code 401");
    assert.strictEqual(
      response.data.status,
      "fail",
      "Expected status to be fail"
    );
    assert.strictEqual(
      response.data.message,
      "Incorrect email or password",
      "Expected error message"
    );
  })
  .catch((error) => {
    console.error("Invalid login test passed.");
  });
