import { z } from "zod";

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  isPublic: z.boolean().default(true),
});

export const groupIdSchema = z
  .string()
  .uuid({ message: "O ID do grupo deve ser um UUID válido. " });
