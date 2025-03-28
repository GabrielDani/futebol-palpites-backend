import { z } from "zod";
import { createFieldSchema } from "../utils/baseSchema.js";

export const createOrUpdateGuessSchema = z.object({
  matchId: createFieldSchema.uuid("matchId"),
  scoreHome: createFieldSchema.positiveInt("scoreHome", { min: 0, max: 10 }),
  scoreAway: createFieldSchema.positiveInt("scoreAway", { min: 0, max: 10 }),
});

export const idSchema = z.object({
  matchId: createFieldSchema.uuid("ID"),
});
