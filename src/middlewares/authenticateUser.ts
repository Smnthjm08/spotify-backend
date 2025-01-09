import { RequestHandler } from "express";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../utils/http";
import AppErrorCode from "../utils/appErrorCode";
import { verifyToken } from "../lib/jwt";
import mongoose from "mongoose";

const authenticateUser: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string;
  // const accessToken = req.cookies.accessToken as string | undefined;
  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized!",
    AppErrorCode.InvalidAccessToken
  );

  const { error, payload } = verifyToken(accessToken);
  appAssert(
    payload,
    UNAUTHORIZED,
    error === "jwt expired" ? "Token expired!" : "Invalid token!",
    AppErrorCode.InvalidAccessToken
  );

  // PENDING: check if user exists
  const typedPayload = payload as {
    userId: mongoose.Types.ObjectId;
    sessionId: mongoose.Types.ObjectId;
  };
  req.userId = typedPayload.userId;
  req.sessionId = typedPayload.sessionId;

  next();
};

export default authenticateUser;
