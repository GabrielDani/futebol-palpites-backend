import { z } from "zod";
import { createFieldSchema } from "../utils/baseSchema.js";

export const idSchema = z.object({
  matchId: createFieldSchema.uuid("ID"),
});

export const createMatchSchema = z.object({
  homeTeamId: createFieldSchema.positiveInt("homeTeamId", { min: 0 }),
  awayTeamId: createFieldSchema.positiveInt("awayTeamId", { min: 0 }),
  matchDate: createFieldSchema.date("matchDate", { required: false }),
  status: z
    .enum(["PENDING", "ONGOING", "FINISHED"])
    .default("PENDING")
    .optional(),
  round: createFieldSchema.positiveInt("round", { min: 1, max: 38 }),
});

export const updateMatchSchema =
  createFieldSchema.transformPartial(createMatchSchema);
