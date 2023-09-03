require("dotenv").config({ path: "../test.env" });
const request = require("supertest");
const app = require("../../app");

expect.extend({
  async toResolveWithin(func, ms) {
    try {
      await Promise.race([
        func(),
        new Promise((_, reject) => setTimeout(() => reject("Timeout"), ms)),
      ]);
      return {
        message: () => `Resolved within ${ms}ms`,
        pass: true,
      };
    } catch (error) {
      return {
        message: () =>
          `Expected to resolve within ${ms}ms, but it didn't. Error: ${error}`,
        pass: false,
      };
    }
  },
});

describe("Login Route", () => {
  let server;

  beforeAll(() => {
    server = app.listen(4000); // Start the server on a specific port for testing
  });

  afterAll((done) => {
    server.close(done); // Close the server after all tests are done
  });

  it("should return a JWT token when logging in", async () => {
    jest.useFakeTimers(); // Enable fake timers

    const responsePromise = request(app)
      .post("/api/v1/users/login")
      .send({ email: "test@hotmail.com", password: "testpassword" });

    jest.advanceTimersByTime(1000); // Advance timers by 1 second (adjust as needed)

    const response = await responsePromise;

    console.log("Response Status:", response.status);
    console.log("Response Body:", response.body);

    await expect(async () => response).toResolveWithin(15000);
    expect(response.status).toBe(200);
  });
});
