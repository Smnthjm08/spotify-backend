import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel, {
  VerificationCodeType,
} from "../models/verificationCode.model";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../utils/env";

export type CreayeAccountParams = {
  email: string;
  password: string;
  username: string;
  userAgent?: string;
};

export const createAccount = async (data: CreayeAccountParams) => {
  // verify existing user with email
  const existingUser = await UserModel.findOne({ email: data.email });

  if (existingUser) {
    throw new Error("User already exists with " + data.email + " email.");
  }

  // create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
    username: data.username
  });

  // creater verification code
  const vericationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: new Date(Date.now() + 20 * 1000 * 60 * 60 * 24),
  });

  // send email with verification code

  //create session
  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  });

  // sign the access and refresh token
  const refreshToken = jwt.sign(
    { sessionId: session._id },
    JWT_REFRESH_SECRET,
    {
      audience: ["user"],
      expiresIn: "30d",
    }
  );

  const accessToken = jwt.sign(
    { userId: user._id, sessionId: session._id },
    JWT_SECRET,
    {
      // can also be role
      audience: ["user"],
      expiresIn: "15m",
    }
  );

  return { user, accessToken, refreshToken };

  //return user & tokens
};
