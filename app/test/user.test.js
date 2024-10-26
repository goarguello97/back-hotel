import app from "../index.js";
import User from "../models/User.js";

dotenv.config({ path: ".env" });

process.env.NODE_ENV = "test";

beforeAll(async () => {
  Promise.all([await app.locals.conectionDB, await User.deleteMany({})]);
});

afterAll(async () => {
  await User.deleteMany({});
});
