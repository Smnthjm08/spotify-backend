import { Router } from "express";
import {
  deleteSessionshandler,
  getSessionshandler,
} from "../controllers/session.controller";

const sessionRoutes = Router();

//prefix /sessions
sessionRoutes.get("/", getSessionshandler);
sessionRoutes.delete("/:id", deleteSessionshandler);

export default sessionRoutes;
