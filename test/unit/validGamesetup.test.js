const { expect } = require("chai");
const sinon = require("sinon");
const gameSetupController = require("../../controllers/gameSetupController");
const GameSetup = require("../../models/gameSetupModel");

describe("GameSetup Controller", () => {
  describe("saveGameSetup Function", () => {
    it("should create a new game setup with valid input data", async () => {
      const req = {
        body: {
          oppositionName: "Opponent",
          gameDescription: "Description",
          selectedTeam: "64f4a5ab782a103529de6d02", // Replace with a valid team ID
          playerSetup: "[]",
        },
        user: {
          _id: "userId", // Replace with a valid user ID
        },
      };

      const res = {
        redirect: sinon.stub(),
      };

      // Mock the GameSetup model's save method
      const saveStub = sinon.stub(GameSetup.prototype, "save");

      await gameSetupController.saveGameSetup(req, res);

      // Assertions
      expect(saveStub.calledOnce).to.be.true;
      expect(res.redirect.calledWith("/recordGames")).to.be.true;

      // Restore the stub
      saveStub.restore();
    });
  });
});
