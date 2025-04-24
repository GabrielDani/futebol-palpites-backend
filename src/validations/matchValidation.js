import { z } from "zod";
import { createFieldSchema } from "../utils/baseSchema.js";

export const idSchema = z.object({
  matchId: createFieldSchema.uuid("ID"),
});

export const quantity = z.object({
  quantity: createFieldSchema.positiveInt("quantity", {
    min: 0,
    max: 10,
    defaultValue: 5,
  }),
});

export const round = z.object({
  round: createFieldSchema.positiveInt("round", {
    min: 1,
    max: 38,
  }),
});

const baseMatchSchema = z.object({
  homeTeamId: createFieldSchema.positiveInt("homeTeamId", { min: 0 }),
  awayTeamId: createFieldSchema.positiveInt("awayTeamId", { min: 0 }),
  scoreHome: createFieldSchema.positiveInt("homeScore", {
    min: 0,
    max: 10,
    required: false,
  }),
  scoreAway: createFieldSchema.positiveInt("awayScore", {
    min: 0,
    max: 10,
    required: false,
  }),
  date: createFieldSchema.date("date", { required: false }),
  status: z.enum(["PENDING", "ONGOING", "FINISHED"]).optional(),
  round: createFieldSchema.positiveInt("round", { min: 1, max: 38 }),
});

export const createMatchSchema = baseMatchSchema.transform((data) => {
  const status =
    data.status ??
    (() => {
      if (!data.date) return "PENDING";

      const offset = -3 * 60;
      const now = new Date(Date.now() + offset * 60 * 1000);
      const matchDate = new Date(data.date);
      const twoHoursAfter = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000);

      if (now > twoHoursAfter) return "FINISHED";
      if (now >= matchDate && now <= twoHoursAfter) return "ONGOING";
      return "PENDING";
    })();

  return {
    ...data,
    status,
  };
});

export const updateMatchSchema =
  createFieldSchema.transformPartial(baseMatchSchema);
