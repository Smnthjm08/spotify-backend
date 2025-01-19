import { z } from "zod";

export const songSchema = z.object({
  title: z.string().min(1, "Song Title is required"),
  artist: z.string(),
  imageUrl: z.string(),
  audioUrl: z.string(),
  duration: z.number(),
  albumId: z.string().optional(),
});
