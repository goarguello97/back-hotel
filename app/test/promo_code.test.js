import dotenv from "dotenv";
import request from "supertest";
import { app } from "../../index.js";
import Offer from "../models/Offer.js";
import PromoCode from "../models/PromoCode.js";
import User from "../models/User.js";

dotenv.config({ path: ".env" });

process.env.NODE_ENV = "test";

beforeAll(async () => {
  await Promise.all([
    app.locals.conectionDB,
    User.deleteMany({}),
    PromoCode.deleteMany({}),
    Offer.deleteMany({}),
  ]);
});

afterAll(async () => {
  await Promise.all([
    User.deleteMany({}),
    PromoCode.deleteMany({}),
    Offer.deleteMany({}),
  ]);
});

xdescribe("GET /promos", () => {
  let id_user = "";
  let name_user = "";
  let id_offer = "";
  let name_offer = "";
  let id_promo = "";
  let code_promo = "";
  let unknowId = "507f1f77bcf86cd799439011";

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("should find all offers", async () => {
    const response = await request(app).get("/api/promos/");
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(Array.isArray(response.body.promos)).toBe(true);
    expect(response.body.promos).toEqual([]);
  });

  it("should find promo by id", async () => {
    const [user, offer] = await Promise.all([
      User.create({
        name: "admin",
        email: "admin@admin.com",
        password: "Pass-1234",
      }),
      Offer.create({
        name: "offer one",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed faucibus ante. Donec eu egestas tellus, et hendrerit ipsum. Duis vitae ultrices quam. Ut fermentum nunc sem, at bibendum risus pellentesque in. Integer nec interdum elit, sit amet hendrerit velit. Curabitur tempus, ante vulputate molestie varius, nisl tellus facilisis augue, ut faucibus metus est nec mauris. In et dolor a orci ultricies iaculis. Sed fermentum sagittis sapien et consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam vulputate vitae sem vitae cursus. Vivamus quam quam, facilisis at ex ut, sagittis ultricies sapien. Maecenas vitae lacus risus. Sed tempus, ante vitae hendrerit faucibus, lectus neque tristique nisl, non tincidunt nisi ligula eget urna.",
      }),
    ]);

    id_user = user._id.toString();
    name_user = user.name;
    id_offer = offer._id.toString();
    name_offer = offer.name;

    const promo = await PromoCode.create({ user: id_user, offer: id_offer });
    id_promo = promo._id.toString();
    code_promo = promo.code;
    const response = await request(app).get(`/api/promos/${id_promo}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(response.body.promo).toHaveProperty("_id", id_promo);
    expect(response.body.promo).toHaveProperty("code", code_promo);
    expect(response.body.promo.user).toHaveProperty("_id", id_user);
    expect(response.body.promo.user).toHaveProperty("name", name_user);
    expect(response.body.promo.offer).toHaveProperty("_id", id_offer);
    expect(response.body.promo.offer).toHaveProperty("name", name_offer);
  });

  it("should not find a promo by incorrect id", async () => {
    const response = await request(app).get(`/api/promos/${unknowId}`);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
  });
});

describe("POST /promos", () => {
  let id_user = "";
  let name_user = "";
  let id_offer = "";
  let name_offer = "";
  let id_promo = "";
  let code_promo = "";
  let unknowId = "507f1f77bcf86cd799439011";

  afterEach(async () => {
    await User.deleteMany({});
  });

  it("shoul post new promo", async () => {
    const [user, offer] = await Promise.all([
      User.create({
        name: "admin",
        email: "admin@admin.com",
        password: "Pass-1234",
      }),
      Offer.create({
        name: "offer one",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed faucibus ante. Donec eu egestas tellus, et hendrerit ipsum. Duis vitae ultrices quam. Ut fermentum nunc sem, at bibendum risus pellentesque in. Integer nec interdum elit, sit amet hendrerit velit. Curabitur tempus, ante vulputate molestie varius, nisl tellus facilisis augue, ut faucibus metus est nec mauris. In et dolor a orci ultricies iaculis. Sed fermentum sagittis sapien et consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam vulputate vitae sem vitae cursus. Vivamus quam quam, facilisis at ex ut, sagittis ultricies sapien. Maecenas vitae lacus risus. Sed tempus, ante vitae hendrerit faucibus, lectus neque tristique nisl, non tincidunt nisi ligula eget urna.",
      }),
    ]);

    id_user = user._id.toString();
    name_user = user.name;
    id_offer = offer._id.toString();
    name_offer = offer.name;

    const response = await request(app)
      .post("/api/promos")
      .send({ user: id_user, offer: id_offer });

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(response.body.promo.user).toHaveProperty("_id", id_user);
    expect(response.body.promo.user).toHaveProperty("name", name_user);
    expect(response.body.promo.offer).toHaveProperty("_id", id_offer);
    expect(response.body.promo.offer).toHaveProperty("name", name_offer);
  });

  it("should not create new promo if there are missing fields(user)", async () => {
    const [user, offer] = await Promise.all([
      User.create({
        name: "admin",
        email: "admin@admin.com",
        password: "Pass-1234",
      }),
      Offer.create({
        name: "offer one",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed faucibus ante. Donec eu egestas tellus, et hendrerit ipsum. Duis vitae ultrices quam. Ut fermentum nunc sem, at bibendum risus pellentesque in. Integer nec interdum elit, sit amet hendrerit velit. Curabitur tempus, ante vulputate molestie varius, nisl tellus facilisis augue, ut faucibus metus est nec mauris. In et dolor a orci ultricies iaculis. Sed fermentum sagittis sapien et consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam vulputate vitae sem vitae cursus. Vivamus quam quam, facilisis at ex ut, sagittis ultricies sapien. Maecenas vitae lacus risus. Sed tempus, ante vitae hendrerit faucibus, lectus neque tristique nisl, non tincidunt nisi ligula eget urna.",
      }),
    ]);

    id_user = user._id.toString();
    name_user = user.name;
    id_offer = offer._id.toString();
    name_offer = offer.name;

    const response = await request(app)
      .post("/api/promos")
      .send({ offer: id_offer });

    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toEqual("User is required");
  });
  it("should not create new promo if there are missing fields(offer)", async () => {
    const [user, offer] = await Promise.all([
      User.create({
        name: "admin",
        email: "admin@admin.com",
        password: "Pass-1234",
      }),
      Offer.create({
        name: "offer one",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed faucibus ante. Donec eu egestas tellus, et hendrerit ipsum. Duis vitae ultrices quam. Ut fermentum nunc sem, at bibendum risus pellentesque in. Integer nec interdum elit, sit amet hendrerit velit. Curabitur tempus, ante vulputate molestie varius, nisl tellus facilisis augue, ut faucibus metus est nec mauris. In et dolor a orci ultricies iaculis. Sed fermentum sagittis sapien et consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam vulputate vitae sem vitae cursus. Vivamus quam quam, facilisis at ex ut, sagittis ultricies sapien. Maecenas vitae lacus risus. Sed tempus, ante vitae hendrerit faucibus, lectus neque tristique nisl, non tincidunt nisi ligula eget urna.",
      }),
    ]);

    id_user = user._id.toString();
    name_user = user.name;
    id_offer = offer._id.toString();
    name_offer = offer.name;

    const response = await request(app)
      .post("/api/promos")
      .send({ user: id_user });

    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toEqual("Offer is required");
  });
});
