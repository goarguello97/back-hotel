import { Router } from "express";
import OfferController from "../controllers/OfferControllers.js";

const offerRouter = Router();

offerRouter.get("/", OfferController.getOffers);
offerRouter.get("/:id", OfferController.getOfferById);
offerRouter.post("/", OfferController.addOffer);
offerRouter.put("/:id", OfferController.updateOffer);
offerRouter.delete("/:id", OfferController.deleteOffer);

export default offerRouter;
