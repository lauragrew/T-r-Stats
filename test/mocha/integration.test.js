const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../app"); // Import your Express app
const expect = chai.expect;

chai.use(chaiHttp);

describe("Authentication Integration Tests", () => {
  // Test user data for login
  const loginData = {
    email: "test@example.com",
    password: "testpassword",
  };

  // Test user login
  it("should login successfully", async () => {
    const res = await chai
      .request(app)
      .post("/api/v1/users/login")
      .send(loginData);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status").equal("success");
    expect(res.body).to.have.property("token");
    // You can add more assertions here based on your response structure
  });

  // Add more integration tests as needed

  // Cleanup or logout after tests
  after(async () => {
    await chai.request(app).get("/api/v1/users/logout");
  });
});
