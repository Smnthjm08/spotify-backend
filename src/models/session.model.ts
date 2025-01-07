import mongoose from "mongoose";

export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  // accessToken: string;
  // refreshToken: string;
  createdAt: Date;
  expiresAt: Date;
}

const sessionSchema = new mongoose.Schema<SessionDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  userAgent: { type: String },
  // accessToken: { type: String, required: true },
  // refreshToken: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
  expiresAt: {
    type: Date,
    default: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  },
});

const SessionModel = mongoose.model<SessionDocument>("Session", sessionSchema);

export default SessionModel;
