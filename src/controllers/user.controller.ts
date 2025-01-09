import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchError";

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);

  appAssert(user, 404, "User not found");

  return res.status(200).json(user.omitPassword());
});
