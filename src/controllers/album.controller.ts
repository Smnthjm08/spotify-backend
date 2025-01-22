import { AlbumModel } from "../models/album.model";
import catchErrors from "../utils/catchError";

export const getAllAlbums = catchErrors(async (req, res) => {
  try {
    const albums = await AlbumModel.find();
    res.status(200).json(albums);
  } catch (error) {
    console.log("Error at getAllAlbums", error);
    res.status(500).json({ message: "Internal server Error", error });
  }
});

export const getAlbumById = catchErrors(async (req, res) => {
  try {
    const { id } = req.params;

    const album = await AlbumModel.findById(id).populate("songs");

    if (!album) {
      return res.status(400).json({ message: "Album not found" });
    }

    res.status(200).json(album);
  } catch (error) {
    console.log("Error at getAlbumById", error);
    res.status(500).json({ message: "Internal server Error", error });
  }
});
