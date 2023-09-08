const request = require("supertest");
const app = require("../app");

describe("Dashboard Access", () => {
  it("should redirect unauthenticated user to login page", (done) => {
    request(app)
      .get("/dashboard") // Adjust the URL to your dashboard route
      .expect(302) // Expect a redirect status code (302 Found)
      .expect("Location", "/statsLogin") // Expect the redirect location
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
