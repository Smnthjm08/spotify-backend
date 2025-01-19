import { Router } from "express";
import authenticateUser from "../middlewares/authenticateUser";
import { getAllUsers, getMyProfile } from "../controllers/user.controller";

const userRoutes = Router();

// prefix: /user
userRoutes.get("/my-profile", authenticateUser, getMyProfile);
userRoutes.get("/", authenticateUser, getAllUsers);

export default userRoutes;
