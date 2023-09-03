const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../app"); // Import your Express app

const { expect } = chai;
chai.use(chaiHttp);

describe("Login Route", () => {
  it("should return a JWT token when logging in", (done) => {
    chai
      .request(app)
      .post("/api/v1/users/login")
      .send({ email: "test@hotmail.com", password: "testpassword" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("status").to.equal("success");
        expect(res.body).to.have.property("token").to.be.a("string");
        // You can add more assertions based on your response structure
        done();
      });
  });
});
