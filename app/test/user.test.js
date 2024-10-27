import dotenv from "dotenv";
import request from "supertest";
import { app } from "../../index.js";
import User from "../models/User.js";

dotenv.config({ path: ".env" });

process.env.NODE_ENV = "test";

beforeAll(async () => {
  await Promise.all([app.locals.conectionDB, User.deleteMany({})]);
});

afterAll(async () => {
  await User.deleteMany({});
});

describe("GET /users", () => {
  let id = "";
  let name = "";
  let email = "";
  beforeAll(async () => {
    const user = await User.create({
      name: "admin",
      email: "admin@admin.com",
      password: "Pass-1234",
    });

    id = user._id.toString();
    name = user.name;
    email = user.email;
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  xit("should find all users", async () => {
    const response = await request(app).get("/api/users/");
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(Array.isArray(response.body.users)).toBe(true);
    expect(response.body.users).toEqual([]);
  });

  it("should find user by id", async () => {
    const response = await request(app).get(`/api/users/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(response.body.user).toHaveProperty("_id", id);
    expect(response.body.user).toHaveProperty("name", name);
    expect(response.body.user).toHaveProperty("email", email);
  });
});
