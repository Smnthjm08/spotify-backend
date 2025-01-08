/**
 *  Asserts a conditon and throws an AppError if the condition is Falsy.
 */
import assert from "node:assert";
import AppError from "./appError";
import { HttpStatusCode } from "./http";
import AppErrorCode from "./appErrorCode";

type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

const appAssert: AppAssert = (
  condition,
  HttpStatusCode,
  message,
  appErrorCode
) => assert(condition, new AppError(HttpStatusCode, message, appErrorCode));

export default appAssert;
