import { Router } from "express";
import UserControllers from "../controllers/UserControllers.js";

const userRouter = Router();

userRouter.get("/", UserControllers.getUsers);
userRouter.get("/:id", UserControllers.getUserById);

export default userRouter;
