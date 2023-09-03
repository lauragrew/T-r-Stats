require("dotenv").config({ path: "./test.env" });

module.exports = {
  testMatch: ["**/test/unit/*.test.js"],
  setupFilesAfterEnv: [],
  globalSetup: "./test/setup.js",
  globalTeardown: "./test/teardown.js",
};
