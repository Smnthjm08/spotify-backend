import { Router } from "express";
import { registerHandler } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.get("/", (req, res) => {
  res.send("Hello from auth route GET method");
});

authRoutes.post("/register", registerHandler);

export default authRoutes;
