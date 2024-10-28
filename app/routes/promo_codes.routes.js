import { Router } from "express";
import PromoCodeControllers from "../controllers/PromoCodeControllers.js";

const promoRouter = Router();

promoRouter.get("/", PromoCodeControllers.getPromos);
promoRouter.get("/:id", PromoCodeControllers.getPromoById);
promoRouter.post("/", PromoCodeControllers.addPromo);

export default promoRouter;
