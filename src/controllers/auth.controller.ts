import { Response } from "express";
import {
  emailSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  verificationCodeScehma,
} from "../schemas/auth.schema";
import {
  createAccount,
  loginUser,
  refreshUserAccessToken,
  resetPassword,
  sendPasswordResetEmail,
  verifyEmail,
} from "../services/auth.service";
import catchErrors from "../utils/catchError";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import { verifyToken } from "../lib/jwt";
import SessionModel from "../models/session.model";
import appAssert from "../utils/appAssert";
import { UNAUTHORIZED } from "../utils/http";

// register controller
export const registerHandler = catchErrors(async (req, res: Response) => {
  //validate request
  const body = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  //call the auth service
  const { user, accessToken, refreshToken } = await createAccount(body);

  //return response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(201)
    .json(user);
});

// login controller
export const loginHandler = catchErrors(async (req, res) => {
  // validate the request
  const body = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // call the service
  const { accessToken, refreshToken } = await loginUser(body);

  return setAuthCookies({ res, accessToken, refreshToken }).status(200).json({
    message: "Login Successful!",
  });
});

// logout controller
export const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken;
  const { payload } = verifyToken(accessToken);

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }

  clearAuthCookies(res);
  return res.status(200).json({
    message: "Logout Successful.",
  });
});

//refresh controller
export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  appAssert(refreshToken, UNAUTHORIZED, "Missing Refresh Token!");

  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  );

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
      message: "Access token refreshed!",
    });
});

//verfiyEmailHandler
export const verifyEmailHandler = catchErrors(async (req, res) => {
  const verificationCode = verificationCodeScehma.parse(req.params.code);

  await verifyEmail(verificationCode);

  return res.status(200).json({
    message: "Email verified successfully!",
  });
});

//sendPaswordResetHandler
export const sendPaswordResetHandler = catchErrors(async (req, res) => {
  const email = emailSchema.parse(req.body.email);

  //call service
  await sendPasswordResetEmail(email);

  return res.status(200).json({
    message: "Password reset email sent successfully!",
  });
});

//reset password handler
export const resetPasswordHandler = catchErrors(async (req, res) => {
  const body = resetPasswordSchema.parse(req.body);

  //call the reset password service
  await resetPassword(body);
  clearAuthCookies(res);

  return res.status(200).json({
    message: "Password reset successfully!",
  });
});
