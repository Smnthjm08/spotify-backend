import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel, {
  VerificationCodeType,
} from "../models/verificationCode.model";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../utils/env";
import appAssert from "../utils/appAssert";
import { CONFLICT, UNAUTHORIZED } from "../utils/http";
import { refreshTokenSignOptions, signToken } from "../lib/jwt";

export type CreateAccountParams = {
  email: string;
  password: string;
  username: string;
  userAgent?: string;
};

export type loginAccountParams = {
  email: string;
  password: string;
  username?: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  // verify existing user with email
  const existingUser = await UserModel.findOne({ email: data.email });

  appAssert(
    !existingUser,
    CONFLICT,
    `User already exists with ${data.email} email.`
  );
  // if (existingUser) {
  //   throw new Error("User already exists with " + data.email + " email.");
  // }

  // create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
    username: data.username,
  });

  const userId = user._id;

  // creater verification code
  const vericationCode = await VerificationCodeModel.create({
    userId: userId,
    type: VerificationCodeType.EmailVerification,
    expiresAt: new Date(Date.now() + 20 * 1000 * 60 * 60 * 24),
  });

  // send email with verification code

  //create session
  const session = await SessionModel.create({
    userId: userId,
    userAgent: data.userAgent,
  });

  // sign the access and refresh token
  const refreshToken = signToken({ sessionId: session._id });

  const accessToken = signToken({ userId: userId, sessionId: session._id });

  //return user & tokens
  return { user: user.omitPassword(), accessToken, refreshToken };
};

//PENDING: username based authentication needs to be done
export const loginUser = async ({
  email,
  password,
  userAgent,
}: loginAccountParams) => {
  //get user by email or username
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  //validate password from the request
  const passwordValidate = await user.comparePassword(password);
  appAssert(passwordValidate, UNAUTHORIZED, "Invalid email or password");

  // create a session
  const userId = user._id;

  const session = await SessionModel.create({ userId, userAgent });

  const sessionInfo = {
    sessionId: session._id,
  };

  //sign access and refresh token
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({
    ...sessionInfo,
    userId: userId,
  });

  // return the user and the token
  return { user: user.omitPassword(), accessToken, refreshToken };
};
