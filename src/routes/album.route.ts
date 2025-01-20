import { Router } from "express";
import { getAlbumById, getAllAlbums } from "../controllers/album.controller";

const albumRouter = Router();

// No need to authenticate user for album routes
// albumRouter.use(authenticateUser);

albumRouter.get("/", getAllAlbums);
albumRouter.get("/:id", getAlbumById);

export default albumRouter;
