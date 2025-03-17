import { z } from "zod";

export const loginSchema = z.object({
  nickname: z.string().min(1, { message: "O nickname é obrigatório." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});
