const authController = require("../../controllers/authController");
const User = require("../../models/userModel"); // Import your User model or mock it if needed
const jwt = require("jsonwebtoken");

describe("Login Function", () => {
  // Create a mock user data for testing
  const mockUserData = {
    _id: "mockUserId",
    email: "test@hotmail.com",
    password: "$2a$12$k0mbEIe8coa08mPjfRSBt.6136he6huDcnx/OTT4TyP2QMPiXQJ/W", // Ensure this is the hashed password for 'testpassword'
  };

  // Mock the request and response objects
  const req = { body: { email: "test@hotmail.com", password: "testpassword" } };
  const res = {
    status: jasmine.createSpy("res.status"),
    json: jasmine.createSpy("res.json"),
    cookie: jasmine.createSpy("res.cookie"),
  };

  // Mock JWT sign method
  spyOn(jwt, "sign").and.returnValue("mockToken");

  beforeEach(() => {
    // Create spies for your methods or reset spies if needed
    spyOn(User, "findOne").and.returnValue(Promise.resolve(mockUserData));
  });

  afterAll(() => {
    // Clean up or reset any changes made during testing
  });

  it("should successfully login and return a JWT token", async () => {
    // Call the login function
    await authController.login(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      token: "mockToken", // Check that the token is correctly returned
      data: {
        user: jasmine.objectContaining({
          _id: "mockUserId", // Check user properties
          email: "test@hotmail.com",
        }),
        redirectUrl: "/dashboard", // Check the expected redirect URL
      },
    });
  });

  it("should fail if the password is incorrect", async () => {
    // Modify the behavior of User.findOne to return null (user not found)
    User.findOne.and.returnValue(Promise.resolve(null));

    // Call the login function
    await authController.login(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      error: "Incorrect email or password",
    });
  });

  // Add more test cases for other scenarios as needed
});
