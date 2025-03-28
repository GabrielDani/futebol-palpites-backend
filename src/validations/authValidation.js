import { z } from "zod";
import { createFieldSchema } from "../utils/baseSchema.js";

export const loginSchema = z.object({
  nickname: createFieldSchema.string("nickname", { min: 3, max: 15 }),
  password: createFieldSchema.string("password", { min: 4, max: 10 }),
});
