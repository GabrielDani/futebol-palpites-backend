import { z } from "zod";

const noSpacesRegex = /^\S*$/;

export const uuidUserSchema = z.string().uuid("O ID deve ser padrão UUID.");

export const nicknameUserSchema = z
  .string()
  .min(3, "O nickname deve ter pelo menos 3 caracteres.")
  .regex(noSpacesRegex, "O nickname não pode conter espaços.");

export const createUserSchema = z.object({
  nickname: z
    .string()
    .min(3, "O nickname deve ter pelo menos 3 caracteres.")
    .regex(noSpacesRegex, "O nickname não pode conter espaços."),
  password: z.string().min(5, "A senha deve ter pelo menos 5 caracteres."),
});

export const updateUserSchema = createUserSchema.partial();
