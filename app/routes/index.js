import { Router } from "express";
import offerRouter from "./offer.routes.js";
import promoRouter from "./promo_codes.routes.js";
import userRouter from "./user.routes.js";

const router = Router();

router.use("/users", userRouter);
router.use("/offers", offerRouter);
router.use("/promos", promoRouter);

export default router;
