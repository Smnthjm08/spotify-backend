import mongoose from "mongoose";

export interface Song extends mongoose.Document {
  title: string;
  artist: string;
  imageUrl: string;
  audioUrl: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
  albumId: mongoose.Types.ObjectId;
}

const songSchema = new mongoose.Schema<Song>(
  {
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
      required: false,
    },
  },
  { timestamps: true }
);

export const SongModel = mongoose.model<Song>("Song", songSchema);
