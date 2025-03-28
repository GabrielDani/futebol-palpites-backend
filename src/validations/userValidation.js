import { z } from "zod";
import { createFieldSchema } from "../utils/baseSchema.js";

const noSpacesRegex = /^\S*$/;

export const idSchema = z.object({
  id: createFieldSchema.uuid("ID"),
});

export const nicknameSchema = z.object({
  nickname: createFieldSchema
    .string("nickname", { min: 3, max: 15 })
    .regex(noSpacesRegex, "O nickname não pode conter espaços"),
});

export const createSchema = z.object({
  nickname: createFieldSchema
    .string("nickname", { min: 3, max: 15 })
    .regex(noSpacesRegex, "O nickname não pode conter espaços"),
  password: createFieldSchema.string("password", { min: 3, max: 15 }),
});

export const updateSchema = createFieldSchema.transformPartial(createSchema);
