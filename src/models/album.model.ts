import mongoose from "mongoose";

export interface Album extends mongoose.Document {
  title: string;
  artist: string;
  imageUrl: string;
  releaseYear: Date;
  songs: mongoose.Types.ObjectId[];
}

const albumSchema = new mongoose.Schema<Album>(
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
    releaseYear: {
      type: Date,
      required: true,
    },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Song" }],
  },
  { timestamps: true }
);

export const AlbumModel = mongoose.model<Album>("Album", albumSchema);
