import { z } from "zod";

export const albumSchema = z.object({
  title: z.string().min(1),
  artist: z.string(),
  imageUrl: z.string(),
  releaseYear: z.date(),
  songs: z.string(),
});
