import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./lib/db";
import fileUpload from "express-fileupload";
import path from "path";

import userRoutes from "./routes/user.route";
import adminRoutes from "./routes/admin.route";
import authRoutes from "./routes/auth.route";
import songRoutes from "./routes/song.route";
import albumRoutes from "./routes/album.route";
import statsRoutes from "./routes/stats.route";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorHandler";
import authenticateUser from "./middlewares/authenticateUser";
import sessionRoutes from "./routes/session.route";

dotenv.config();

const app = express();
// const __dirname = path.resolve();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.APP_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024, //10mb max file size
    },
  })
);

const PORT = process.env.PORT || 5001;

// app.get("/", (_, res) => {
//   return res.status(200).json({
//     status: "healthy",
//   });
// });

app.use(errorHandler);

app.use("/api/auth", authRoutes);

app.use("/api/user", authenticateUser, userRoutes);
app.use("/api/sessions", authenticateUser, sessionRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/album", albumRoutes);
app.use("/api/stats", statsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDb();
});
