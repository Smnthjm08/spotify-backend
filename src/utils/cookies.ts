import { CookieOptions, Response } from "express";
import { NODE_ENV } from "./env";

export const REFRESH_PATH = "/auth/refresh";
const secure = process.env.NODE_ENV !== "development";

const defaults: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  // 15 minutes
  ...defaults,
  expires: new Date(Date.now() + 15 * 60 * 1000), // Correct
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  // 30 days
  ...defaults,
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Correct (30 days in milliseconds)
  path: REFRESH_PATH,
});

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({
  res,
  accessToken,
  refreshToken,
}: Params): Response => {
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken").clearCookie("refreshToken", {
    path: REFRESH_PATH,
  });
};
