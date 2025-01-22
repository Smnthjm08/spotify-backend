import { Router } from "express";
import {
  getAllSongs,
  getMadeForYouSongs,
  getSongById,
  getTrendingSongs,
} from "../controllers/song.controller";
import authenticateUser from "../middlewares/authenticateUser";
import { getFeaturedSongs } from '../controllers/song.controller';

const songRouter = Router();

songRouter.get("/", authenticateUser, getAllSongs);
// songRouter.get("/:id", authenticateUser, getSongById);
songRouter.get("/made-for-you", authenticateUser, getMadeForYouSongs);
songRouter.get("/trending", authenticateUser, getTrendingSongs);
songRouter.get("/featured", authenticateUser, getFeaturedSongs);

export default songRouter;
