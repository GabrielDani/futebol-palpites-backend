import { z } from "zod";
import { createFieldSchema } from "../utils/baseSchema.js";

export const createGroupSchema = z.object({
  name: createFieldSchema.string("name", { min: 3, max: 15 }),
  isPublic: createFieldSchema.boolean("isPublic", {
    defaultValue: false,
    required: false,
  }),
});

export const idSchema = z.object({
  groupId: createFieldSchema.uuid("ID"),
});
