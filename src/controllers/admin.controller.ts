import { AlbumModel } from "../models/album.model";
import { SongModel } from "../models/song.model";
import { albumSchema } from "../schemas/album.scema";
import { songSchema } from "../schemas/song.schema";
import { uploadToCloudinary } from "../services/cloduinary.service";
import catchErrors from "../utils/catchError";

export const createSong = catchErrors(async (req, res) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all the files" });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const validatedData = songSchema.parse({
      title,
      artist,
      duration: Number(duration),
      audioUrl: audioUrl,
      imageUrl: imageUrl,
      albumId: albumId || null,
    });

    const song = new SongModel({
      ...validatedData,
    });

    await song.save();

    // if song belongs to any album, update the album model as well
    if (albumId) {
      await AlbumModel.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    res.status(201).json(song);
  } catch (error) {
    console.log("Error at createSong", error);
    res.status(500).json({ message: "Internal server Error", error });
  }
});

export const deleteSong = catchErrors(async (req, res) => {
  try {
    const { id } = req.params;

    const song = await SongModel.findById(id);

    if (!song) {
      return res.status(404).json({ Error: "Unable to find the Song" });
    }

    if (song?.albumId) {
      await AlbumModel.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await SongModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error at createSong", error);
    res.status(500).json({ message: "Internal server Error", error });
  }
});

export const createAlbum = catchErrors(async (req, res) => {
  try {
    const { title, artist, releaseYear } = req.body;
    if (!req.files || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload the image file" });
    }
    const imageFile = req.files.imageFile;

    const imageUrl = await uploadToCloudinary(imageFile);

    const validatedData = albumSchema.parse({
      title,
      artist,
      releaseYear: new Date(releaseYear),
      imageUrl: imageUrl,
    });

    const album = new AlbumModel({ ...validatedData });
    await album.save();

    res.status(201).json(album);
  } catch (error) {
    console.log("Error at createAlbum", error);
    res.status(500).json({ message: "Internal server Error", error });
  }
});

export const deleteAlbum = catchErrors(async (req, res) => {
  try {
    const { id } = req.params;

    const album = await AlbumModel.findById(id);

    if (!album) {
      return res.status(404).json({ Error: "Unable to find the Album" });
    }

    await SongModel.deleteMany({ albumId: id });

    await AlbumModel.findByIdAndDelete(id);

    res.status(201).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error at createSong", error);
    res.status(500).json({ message: "Internal server Error", error });
  }
});

// PENDING
// export const checkAdmin = catchErrors(async (req, res) => {
//   res.status(200).json({ admin: true });
// });
