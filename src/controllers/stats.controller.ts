import { AlbumModel } from "../models/album.model";
import { SongModel } from "../models/song.model";
import UserModel from "../models/user.model";
import catchErrors from "../utils/catchError";

export const getStats = catchErrors(async (req, res) => {
  try {
    // const totalSongs = await SongModel.countDocuments();
    // const totalUsers = await UserModel.countDocuments();
    // const totalAlbums = await AlbumModel.countDocuments();
    // const totalArtists = await Artist.countDocuments();

    const [totalSongs, totalUsers, totalAlbums, uniqueArtists] =
      await Promise.all([
        SongModel.countDocuments(),
        UserModel.countDocuments(),
        AlbumModel.countDocuments(),
        SongModel.aggregate([
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          {
            $group: {
              _id: "$artist",
            },
          },
          {
            $count: "count",
          },
        ]),
      ]);

    res.status(200).json({
      totalAlbums,
      totalSongs,
      totalUsers,
      totalArtists: uniqueArtists[0]?.count || 0,
    });
  } catch (error) {
    console.log("Error at getStats", error);
    res.status(500).json({ message: "Internal server Error", error });
  }
});
