const request = require("supertest");
const app = require("../../app.js"); // Replace with the actual path to your Express app file

describe("GET /about", () => {
  it("responds with 200 status and correct content", async () => {
    const response = await request(app).get("/about");
    expect(response.status).toBe(200);
    // You can add more assertions here based on the expected content
  });
});
