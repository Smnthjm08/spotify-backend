import { Router } from "express";
import authenticateUser from "../middlewares/authenticateUser";
import { deleteAlbum } from "../controllers/admin.controller";
import {
  createAlbum,
  createSong,
  deleteSong,
} from "../controllers/admin.controller";

const adminRouter = Router();

adminRouter.use(authenticateUser);
// adminRouter.get("/check", authenticateUser, isUserAdmin, checkAdmin )

adminRouter.post("/songs", createSong);
adminRouter.delete("/songs/:id", deleteSong);

adminRouter.post("/albums", createAlbum);
adminRouter.delete("/albums/:id", deleteAlbum);

export default adminRouter;
