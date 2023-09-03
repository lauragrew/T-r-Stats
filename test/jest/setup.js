const dotenv = require("dotenv");

// Load environment variables from the .env file
dotenv.config({ path: "./test.env" });

// Rest of your setup code
const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Add an afterEach hook to clean up after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});
