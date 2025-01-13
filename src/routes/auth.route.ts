import { Router } from "express";
import {
  loginHandler,
  registerHandler,
  logoutHandler,
  refreshHandler,
  verifyEmailHandler,
  sendPaswordResetHandler,
  resetPasswordHandler,
} from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.get("/", (req, res) => {
  res.send("Hello from auth route GET method");
});

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/email/verify/:code", verifyEmailHandler);
authRoutes.post("/forgot-password", sendPaswordResetHandler);
authRoutes.post("/reset-password", resetPasswordHandler);

export default authRoutes;
