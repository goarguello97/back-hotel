import { Router } from "express";
import UserControllers from "../controllers/UserControllers.js";

const userRouter = Router();

userRouter.get("/", UserControllers.getUsers);
userRouter.get("/:id", UserControllers.getUserById);
userRouter.post("/", UserControllers.addUser);
userRouter.put("/:id", UserControllers.updateUser);
userRouter.delete("/:id", UserControllers.deleteUser);

export default userRouter;
