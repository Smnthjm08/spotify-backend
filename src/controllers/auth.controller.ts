import { Response } from "express";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { createAccount, loginUser } from "../services/auth.service";
import catchErrors from "../utils/catchError";
import { setAuthCookies } from "../utils/cookies";

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

export const loginHandler = catchErrors(async (req, res) => {
  // validate the request
  const reqBody = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  // call the service
  const { accessToken, refreshToken } = await loginUser(reqBody);

  return setAuthCookies({ res, accessToken, refreshToken }).status(200).json({
    message: "Login Successful!",
  });
});
