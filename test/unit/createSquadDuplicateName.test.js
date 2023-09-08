const { expect } = require("chai");
const sinon = require("sinon"); // For mocking
const squadController = require("../../controllers/squadController");
const Squad = require("../../models/squadModel");

describe("Squad Controller", () => {
  describe("createSquad Function", () => {
    it("should handle the case where a squad with the same name exists for another user", async () => {
      // Mock Squad.findOne to simulate an existing squad
      const findOneStub = sinon.stub(Squad, "findOne").resolves({
        _id: "otherSquadId",
        name: "Test Squad",
        user: "otherUserId",
      });

      const req = {
        body: {
          name: "Test Squad",
        },
        user: {
          _id: "userId",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };

      await squadController.createSquad(req, res);

      // Assertions
      expect(findOneStub.calledOnce).to.be.true;
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledOnce).to.be.true;

      // Restore the original Squad.findOne method
      findOneStub.restore();
    });
  });

  // Other test suites for different controller functions
});
