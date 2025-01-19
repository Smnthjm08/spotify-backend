import UserModel from "../models/user.model";
import appAssert from "../utils/appAssert";
import catchErrors from "../utils/catchError";

export const getMyProfile = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId);

  appAssert(user, 404, "User not found");

  return res.status(200).json(user.omitPassword());
});

export const getAllUsers = catchErrors(async (req, res) => {
  try {
    const currentUserId = req.userId;

    const users = await UserModel.find({ id: { $ne: currentUserId } });

    res.status(200).json(users);
  } catch (error) {
    console.log("Error at getAlbum", error);
    res.status(500).json({ message: "Internal server Error", error });
  }
});


