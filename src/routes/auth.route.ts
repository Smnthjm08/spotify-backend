import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello from auth route GET method");
});

export default router;
