import { Router } from "express";
import { getStats } from "../controllers/stats.controller";

const statsRoute = Router();

// needs to be upadated after the UI
statsRoute.get("/", getStats);

export default statsRoute;
