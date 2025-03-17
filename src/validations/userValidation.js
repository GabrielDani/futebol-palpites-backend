import { z } from "zod";

export const createUserSchema = z.object({
  nickname: z.string().min(3, "O nickname deve ter pelo menos 3 caracteres."),
  password: z.string().min(5, "A senha deve ter pelo menos 5 caracteres."),
});
