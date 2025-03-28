import { z } from "zod";
import { createFieldSchema } from "../utils/baseSchema.js";

export const idSchema = z.object({
  id: createFieldSchema.positiveInt("ID", {
    min: 0,
    max: 50,
  }),
});

export const nameSchema = z.object({
  name: createFieldSchema.string("name", { min: 3 }),
});

export const createTeamSchema = z.object({
  name: createFieldSchema.string("name", { min: 3, max: 20 }),
  shortName: createFieldSchema.string("shortName", { min: 3, max: 3 }),
  logoUrl: createFieldSchema.url("logoUrl"),
});

export const updateTeamSchema =
  createFieldSchema.transformPartial(createTeamSchema);
