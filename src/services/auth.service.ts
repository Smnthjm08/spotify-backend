import SessionModel from "../models/session.model";
import UserModel from "../models/user.model";
import VerificationCodeModel, {
  VerificationCodeType,
} from "../models/verificationCode.model";
import { APP_ORIGIN } from "../utils/env";
import appAssert from "../utils/appAssert";
import { CONFLICT, UNAUTHORIZED } from "../utils/http";
import {
  RefreshTokenPayload,
  refreshTokenSignOptions,
  signToken,
  verifyToken,
} from "../lib/jwt";
import { sendMail } from "../utils/sendMail";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../utils/emailTemplates";
import { coder } from "@project-serum/anchor/dist/cjs/native/system";
import { hashValue } from "../utils/bcrypt";

export type CreateAccountParams = {
  email: string;
  password: string;
  username: string;
  userAgent?: string;
};

export type LoginAccountParams = {
  email: string;
  password: string;
  username?: string;
  userAgent?: string;
};

type ResetPasswordParams = {
  password: string;
  verificationCode: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

const THIRTY_DAYS_FROM_NOW = 30 * 24 * 60 * 60 * 1000;

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

  const url = `${APP_ORIGIN}/email/verify/${vericationCode._id}`;

  // send email with verification code
  // Property 'error' does not exist on type 'void'.ts(2339)

  try {
    await sendMail({ to: user.email, ...getVerifyEmailTemplate(url) });
  } catch (error) {
    console.log(error);
  }

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
}: LoginAccountParams) => {
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

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const now = Date.now();

  const session = await SessionModel.findById(payload.sessionId);

  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session Expired!"
  );

  // refresh the session if it expires in the next 24 hours
  const sessionNeedsRefresh =
    session.expiresAt.getTime() - now <= ONE_DAY_IN_MS;

  if (sessionNeedsRefresh) {
    session.expiresAt = new Date(Date.now() + THIRTY_DAYS_FROM_NOW);
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const verifyEmail = async (code: string) => {
  //get verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: VerificationCodeType.EmailVerification,
    expiresAt: { $gt: Date.now() },
  });
  appAssert(validCode, 404, "Invalid or expired verification code");

  //update user to be verified
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    { isVerified: true },
    { new: true }
  );
  appAssert(updatedUser, 500, "Failed to update user");

  // delete verifcation code
  await VerificationCodeModel.deleteOne();

  return {
    user: updatedUser.omitPassword(),
  };
};

//sendPaswordResetHandler
export const sendPasswordResetEmail = async (email: string) => {
  // Find the user by email
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "User not found");

  // Create verification code
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.PasswordReset,
    expiresAt,
  });

  // Send verification email
  const url = `${APP_ORIGIN}/password/reset?code=${
    verificationCode._id
  }&exp=${expiresAt.getTime()}`;

  try {
    const { data } = await sendMail({
      to: user.email,
      ...getPasswordResetTemplate(url),
    });
    console.log("Email send response:", data); // Log the response
    appAssert(data, 500, "Failed to send email");

    // Return success
    return { url, emailId: data };
  } catch (error) {
    console.error("Error sending email:", error); // Log the error
    appAssert(user, 500, "Failed to send email");
  }
};

//reset password service
export const resetPassword = async ({
  password,
  verificationCode,
}: ResetPasswordParams) => {

  
  // get the verification code
  //PENDING: check if the code is valid
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: VerificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, 404, "Invalid or expired verification code");

  // update the user password
  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: await hashValue(password),
  });
  appAssert(updatedUser, 500, "Internal Server Error");

  // delete the verification code
  await validCode.deleteOne();

  // delete all the session
  await SessionModel.deleteMany({
    userId: updatedUser._id,
  });

  return {
    user: updatedUser.omitPassword(),
  };
};
