import mongoose from "mongoose";

export interface Message extends mongoose.Schema {
  senderId: string;
  recieverId: string;
  content: string;
}

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    recieverId: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);
