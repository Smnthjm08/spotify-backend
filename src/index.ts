import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./lib/db";

import userRoutes from "./routes/user.route";
import adminRoutes from "./routes/admin.route";
import authRoutes from "./routes/auth.route";
import songRoutes from "./routes/song.route";
import albumRoutes from "./routes/album.route";
import statsRoutes from "./routes/stats.route";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());

const PORT = process.env.PORT || 5001;

// app.get("/", (_, res) => {
//   return res.status(200).json({
//     status: "healthy",
//   });
// });

app.use(errorHandler);

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/stats", statsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDb();
});
