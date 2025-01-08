import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { compareValues, hashValue } from "../utils/bcrypt";

export interface User extends mongoose.Document {
  email: string;
  username: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (password: string) => Promise<boolean>;
  omitPassword(): Pick<
    User,
    "_id" | "email" | "verified" | "username" | "createdAt" | "updatedAt"
  >;
}

const userSchema = new mongoose.Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hashValue(this.password);
  next();
});

userSchema.methods.comparePassword = async function (currentPassword: string) {
  return bcrypt.compare(currentPassword, this.password);
};

userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<User>("User", userSchema);

export default UserModel;
