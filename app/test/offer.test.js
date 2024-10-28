import dotenv from "dotenv";
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

  beforeAll(async () => {
    const offer = await User.create({
      name: "offer one",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sed faucibus ante. Donec eu egestas tellus, et hendrerit ipsum. Duis vitae ultrices quam. Ut fermentum nunc sem, at bibendum risus pellentesque in. Integer nec interdum elit, sit amet hendrerit velit. Curabitur tempus, ante vulputate molestie varius, nisl tellus facilisis augue, ut faucibus metus est nec mauris. In et dolor a orci ultricies iaculis. Sed fermentum sagittis sapien et consectetur. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam vulputate vitae sem vitae cursus. Vivamus quam quam, facilisis at ex ut, sagittis ultricies sapien. Maecenas vitae lacus risus. Sed tempus, ante vitae hendrerit faucibus, lectus neque tristique nisl, non tincidunt nisi ligula eget urna.",
    });

    id = offer._id.toString();
    name = offer.name;
    description = offer.description;
  });

  afterEach(async () => {
    await Offer.deleteMany({});
  });

  xit("should find all offers", async () => {
    const response = await request(app).get("/api/offers/");
    expect(response.status).toBe(200);
    expect(response.body.status).toEqual("ok");
    expect(Array.isArray(response.body.offers)).toBe(true);
    expect(response.body.offers).toEqual([]);
  });

  xit("should find offer by id", async () => {
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
  });
});
