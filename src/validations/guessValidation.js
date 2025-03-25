import { z } from "zod";
import { positiveIntSchema, uuidSchema } from "./generalValidation.js";

export const createOrUpdateGuessSchema = z.object({
  matchId: uuidSchema,
  scoreHome: positiveIntSchema,
  scoreAway: positiveIntSchema,
});
