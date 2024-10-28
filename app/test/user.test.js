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
  let unknowId = "507f1f77bcf86cd799439011";

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

  xit("should find user by id", async () => {
    const response = await request(app).get(`/api/users/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(response.body.user).toHaveProperty("_id", id);
    expect(response.body.user).toHaveProperty("name", name);
    expect(response.body.user).toHaveProperty("email", email);
  });

  it("should not find a user by incorrect id", async () => {
    const response = await request(app).get(`/api/users/${unknowId}`);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
  });
});

describe("POST /users", () => {
  beforeAll(async () => {
    await User.deleteMany({});
  });

  it("should not create a user if there are missing fields.(name)", async () => {
    const user = {
      email: "admin@admin.com",
      password: "1234",
    };
    const response = await request(app).post("/api/users/").send(user);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toBe("Name is required.");
  });

  it("should not create a user if there are missing fields.(email)", async () => {
    const user = {
      name: "admin",
      password: "1234",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toBe("Email is required.");
  });

  it("should not create a user if there are missing fields.(password)", async () => {
    const user = {
      name: "admin",
      email: "admin@admin.com",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toBe("Password is required.");
  });

  it("should create a user", async () => {
    const user = {
      name: "admin",
      email: "admin@admin.com",
      password: "1234",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(response.body.user.name).toBe("admin");
  });

  it("should not create a user if email already exists", async () => {
    const user = {
      name: "admin",
      email: "admin@admin.com",
      password: "1234",
    };
    const response = await request(app).post("/api/users").send(user);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toBe("Email is already in use.");
  });
});

describe("PUT /users", () => {
  let id = "";
  let randomId = "507f1f77bcf86cd799439011";
  let name = "";

  beforeAll(async () => {
    await User.deleteMany({});
    const user = await User.create({
      name: "admin",
      email: "admin@admin.com",
      password: "1234",
    });

    id = user._id.toString();
    name = user.name;
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should modify their name of original user", async () => {
    const user = { name: "cosme" };

    const response = await request(app).put(`/api/users/${id}`).send(user);
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(response.body.user.name).toEqual("cosme");
  });

  it("should modify their email of original user", async () => {
    const user = { email: "change@email.com" };

    const response = await request(app).put(`/api/users/${id}`).send(user);
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(response.body.user.email).toEqual("change@email.com");
  });

  it("should cannot modify their name for incorrect id", async () => {
    const user = { name: "cosme" };

    const response = await request(app)
      .put(`/api/users/${randomId}`)
      .send(user);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toBe("User not found");
  });
});

describe("DELETE /users", () => {
  let id = "";
  let unknowId = "507f1f77bcf86cd799439011";
  let name = "";

  beforeAll(async () => {
    await User.deleteMany({});
    const user = await User.create({
      name: "admin",
      email: "admin@admin.com",
      password: "1234",
    });

    id = user._id.toString();
    name = user.name;
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  it("should cannot delete user if the id is not specified", async () => {
    const response = await request(app).delete(`/api/users/${null}`);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toBe("User not found");
  });

  it("should cannot delete user if not exists", async () => {
    const response = await request(app).delete(`/api/users/${unknowId}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toBe("User not found");
  });

  it("should delete user", async () => {
    const response = await request(app).delete(`/api/users/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(response.body.message).toBe("User deleted succesfully");
  });
});
