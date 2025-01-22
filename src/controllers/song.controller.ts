import { SongModel } from '../models/song.model';
import catchErrors from "../utils/catchError";

export const getAllSongs = catchErrors(async (req, res) => {
  try {
    // list the newest one on the top
    const songs = await SongModel.find().sort({ created: -1 });

    res.status(200).json(songs);
  } catch (error) {
    console.log("Error at getAllSongs", error);
    res.status(500).json({ message: "Internal server Error", error });
  }
});

export const getSongById = catchErrors(async (req, res) => {
  try {
    const { id } = req.params;

    const song = await SongModel.findById(id);

    if (!song) {
      return res.status(404).json({ message: "Song Not Found" });
    }

    res.status(200).json(song);
  } catch (error) {
    console.log("Error at getSongById", error);
    res.status(500).json({ message: "Internal server Error", error });
  }
});


export const getFeaturedSongs = catchErrors(async (req, res) => {
  
  try {
      const songs = await SongModel.aggregate([
        {
          $sample: { size: 6 },
        },
        {
          $project: {
            // _id: 1,
            title: 1,
            artist: 1,
            imageUrl: 1,
            audioUrl: 1,
          },
        },
      ]);

    res.status(200).json(songs);
  } catch (error) {
    console.log("Error at getFeaturedSongs", error);
    res.status(500).json({ message: "Internal server Error", error });
  }
});


export const getMadeForYouSongs = catchErrors(async (req, res) => {
    try {
        const songs = await SongModel.aggregate([
          {
            $sample: { size: 4 },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              artist: 1,
              imageUrl: 1,
              audioUrl: 1,
            },
          },
        ]);
    
        res.status(200).json(songs);
      } catch (error) {
        console.log("Error at getMadeForYouSongs", error);
        res.status(500).json({ message: "Internal server Error", error });
      }
});
export const getTrendingSongs = catchErrors(async (req, res) => {
    try {
        const songs = await SongModel.aggregate([
          {
            $sample: { size: 4 },
          },
          {
            $project: {
              _id: 1,
              title: 1,
              artist: 1,
              imageUrl: 1,
              audioUrl: 1,
            },
          },
        ]);
    
        res.status(200).json(songs);
      } catch (error) {
        console.log("Error at getTrendingSongs", error);
        res.status(500).json({ message: "Internal server Error", error });
      }
});
