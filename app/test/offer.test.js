import dotenv from "dotenv";
import request from "supertest";
import { app } from "../../index.js";
import Offer from "../models/Offer";

dotenv.config({ path: ".env" });

process.env.NODE_ENV = "test";

beforeAll(async () => {
  await Promise.all([app.locals.conectionDB, Offer.deleteMany({})]);
});

afterAll(async () => {
  await Offer.deleteMany({});
});

describe("GET /offers", () => {
  let id = "";
  let name = "";
  let description = "";
  let unknowId = "507f1f77bcf86cd799439011";

  afterAll(async () => {
    await Offer.deleteMany({});
  });

  it("should find all offers", async () => {
    const response = await request(app).get("/api/offers/");
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(Array.isArray(response.body.offers)).toBe(true);
    expect(response.body.offers).toEqual([]);
  });

  it("should find offer by id", async () => {
    const offer = await Offer.create({
      name: "offer one",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed faucibus ante. Donec eu egestas tellus, et hendrerit ipsum. Duis vitae ultrices quam. Ut fermentum nunc sem, at bibendum risus pellentesque in. Integer nec interdum elit, sit amet hendrerit velit. Curabitur tempus, ante vulputate molestie varius, nisl tellus facilisis augue, ut faucibus metus est nec mauris. In et dolor a orci ultricies iaculis. Sed fermentum sagittis sapien et consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam vulputate vitae sem vitae cursus. Vivamus quam quam, facilisis at ex ut, sagittis ultricies sapien. Maecenas vitae lacus risus. Sed tempus, ante vitae hendrerit faucibus, lectus neque tristique nisl, non tincidunt nisi ligula eget urna.",
    });

    id = offer._id.toString();
    name = offer.name;
    description = offer.description;

    const response = await request(app).get(`/api/offers/${id}`);
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(response.body.offer).toHaveProperty("_id", id);
    expect(response.body.offer).toHaveProperty("name", name);
    expect(response.body.offer).toHaveProperty("description", description);
  });

  it("should not find a offer by incorrect id", async () => {
    const response = await request(app).get(`/api/offers/${unknowId}`);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toEqual("Offer not found");
  });
});

describe("POST /offers", () => {
  beforeAll(async () => {
    await Offer.deleteMany({});
  });

  it("should not create a offers if there are missing fields.(name)", async () => {
    const offer = {
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed faucibus ante. Donec eu egestas tellus, et hendrerit ipsum. Duis vitae ultrices quam. Ut fermentum nunc sem, at bibendum risus pellentesque in. Integer nec interdum elit, sit amet hendrerit velit. Curabitur tempus, ante vulputate molestie varius, nisl tellus facilisis augue, ut faucibus metus est nec mauris. In et dolor a orci ultricies iaculis. Sed fermentum sagittis sapien et consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam vulputate vitae sem vitae cursus. Vivamus quam quam, facilisis at ex ut, sagittis ultricies sapien. Maecenas vitae lacus risus. Sed tempus, ante vitae hendrerit faucibus, lectus neque tristique nisl, non tincidunt nisi ligula eget urna.",
    };
    const response = await request(app).post("/api/offers/").send(offer);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toBe("Name is required");
  });

  it("should not create a offer if there are missing fields.(description)", async () => {
    const offer = {
      name: "offer one",
    };
    const response = await request(app).post("/api/offers").send(offer);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toBe("Description is required");
  });

  it("should create a offer", async () => {
    const offer = {
      name: "offer one",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed faucibus ante. Donec eu egestas tellus, et hendrerit ipsum. Duis vitae ultrices quam. Ut fermentum nunc sem, at bibendum risus pellentesque in. Integer nec interdum elit, sit amet hendrerit velit. Curabitur tempus, ante vulputate molestie varius, nisl tellus facilisis augue, ut faucibus metus est nec mauris. In et dolor a orci ultricies iaculis. Sed fermentum sagittis sapien et consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam vulputate vitae sem vitae cursus. Vivamus quam quam, facilisis at ex ut, sagittis ultricies sapien. Maecenas vitae lacus risus. Sed tempus, ante vitae hendrerit faucibus, lectus neque tristique nisl, non tincidunt nisi ligula eget urna.",
    };
    const response = await request(app).post("/api/offers").send(offer);
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(response.body.offer.name).toBe("offer one");
  });

  it("should cannot create a offer if name already exists", async () => {
    const offer = {
      name: "offer one",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed faucibus ante. Donec eu egestas tellus, et hendrerit ipsum. Duis vitae ultrices quam. Ut fermentum nunc sem, at bibendum risus pellentesque in. Integer nec interdum elit, sit amet hendrerit velit. Curabitur tempus, ante vulputate molestie varius, nisl tellus facilisis augue, ut faucibus metus est nec mauris. In et dolor a orci ultricies iaculis. Sed fermentum sagittis sapien et consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam vulputate vitae sem vitae cursus. Vivamus quam quam, facilisis at ex ut, sagittis ultricies sapien. Maecenas vitae lacus risus. Sed tempus, ante vitae hendrerit faucibus, lectus neque tristique nisl, non tincidunt nisi ligula eget urna.",
    };

    await Offer.create(offer);
    const response = await request(app).post("/api/offers").send(offer);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toBe("Offer already exists");
  });
});

describe("PUT /offers", () => {
  let id = "";
  let randomId = "507f1f77bcf86cd799439011";
  let name = "";

  beforeAll(async () => {
    await Offer.deleteMany({});
    const offer = await Offer.create({
      name: "offer one",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed faucibus ante. Donec eu egestas tellus, et hendrerit ipsum. Duis vitae ultrices quam. Ut fermentum nunc sem, at bibendum risus pellentesque in. Integer nec interdum elit, sit amet hendrerit velit. Curabitur tempus, ante vulputate molestie varius, nisl tellus facilisis augue, ut faucibus metus est nec mauris. In et dolor a orci ultricies iaculis. Sed fermentum sagittis sapien et consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam vulputate vitae sem vitae cursus. Vivamus quam quam, facilisis at ex ut, sagittis ultricies sapien. Maecenas vitae lacus risus. Sed tempus, ante vitae hendrerit faucibus, lectus neque tristique nisl, non tincidunt nisi ligula eget urna.",
    });

    id = offer._id.toString();
    name = offer.name;
  });

  afterAll(async () => {
    await Offer.deleteMany({});
  });

  it("should modify their name of original offer", async () => {
    const offer = {
      description: "modified",
    };

    const response = await request(app).put(`/api/offers/${id}`).send(offer);
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(response.body.offer.description).toEqual("modified");
  });

  it("should cannot modify their name for incorrect id", async () => {
    const offer = {
      description: "modified",
    };

    const response = await request(app)
      .put(`/api/offers/${randomId}`)
      .send(offer);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toBe("Offer not found");
  });
});

describe("DELETE /offers", () => {
  let id = "";
  let unknowId = "507f1f77bcf86cd799439011";
  let name = "";

  beforeAll(async () => {
    await Offer.deleteMany({});
    const offer = await Offer.create({
      name: "offer one",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed faucibus ante. Donec eu egestas tellus, et hendrerit ipsum. Duis vitae ultrices quam. Ut fermentum nunc sem, at bibendum risus pellentesque in. Integer nec interdum elit, sit amet hendrerit velit. Curabitur tempus, ante vulputate molestie varius, nisl tellus facilisis augue, ut faucibus metus est nec mauris. In et dolor a orci ultricies iaculis. Sed fermentum sagittis sapien et consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam vulputate vitae sem vitae cursus. Vivamus quam quam, facilisis at ex ut, sagittis ultricies sapien. Maecenas vitae lacus risus. Sed tempus, ante vitae hendrerit faucibus, lectus neque tristique nisl, non tincidunt nisi ligula eget urna.",
    });

    id = offer._id.toString();
    name = offer.name;
  });

  afterAll(async () => {
    await Offer.deleteMany({});
  });

  it("should cannot delete offer if the id is not specified", async () => {
    const response = await request(app).delete(`/api/offers/${null}`);
    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toBe("Offer not found");
  });

  it("should cannot delete offer if not exists", async () => {
    const response = await request(app).delete(`/api/offers/${unknowId}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toEqual("failed");
    expect(response.body.message).toBe("Offer not found");
  });

  it("should delete offer", async () => {
    const response = await request(app).delete(`/api/offers/${id}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(response.body.message).toBe("Offer deleted succesfully");
  });
});
