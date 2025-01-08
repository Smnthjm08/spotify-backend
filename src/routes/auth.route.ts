import { Router } from "express";
import { loginHandler, registerHandler } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.get("/", (req, res) => {
  res.send("Hello from auth route GET method");
});

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);

export default authRoutes;
