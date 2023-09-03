const axios = require("axios");
const assert = require("assert");

// Define your API endpoint and sample login data
const apiUrl = "http://localhost:3000/api/v1/users/login";
URL;
const loginData = {
  email: "test@hotmail.com",
  password: "testpassword",
};

// Send a POST request to the login endpoint
axios
  .post(apiUrl, loginData, {
    headers: {
      Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0ZjMzNzYwZTU2MmQ1NDQ3MDk5ZWM0MiIsImlhdCI6MTY5MzcwMDQxNCwiZXhwIjoxNzAxNDc2NDE0fQ.wlR2n0sqGPBrggKoEiSvMZkb_AwXc2nP7Gl0_CwO__c`, // Replace with the actual token
    },
  })
  .then((response) => {
    // Make assertions about the response
    assert.strictEqual(response.status, 200, "Expected status code 200");
    assert.strictEqual(
      response.data.status,
      "success",
      "Expected status to be success"
    );
    assert.ok(response.data.token, "Expected a token in the response");

    console.log("Login test passed.");
  })
  .catch((error) => {
    console.error("Login test failed:", error.message);
  });
