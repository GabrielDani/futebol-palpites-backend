import { z } from "zod";

export const idTeamSchema = z.number().int("O ID deve ser um número inteiro");

export const createTeamSchema = z.object({
  name: z.string().min(3, "O nome do time deve ter pelo menos 3 caracteres."),
  shortName: z
    .string()
    .length(3, "A abreviação do time deve ter 3 caracteres.")
    .regex(
      /^[A-Z]{3}$/,
      "A abreviação do time deve ter exatamente 3 letras maiúsculas."
    )
    .optional(),
  logoUrl: z.string().url("A URL do logo deve ser uma URL válida.").optional(),
});

export const updateTeamSchema = createTeamSchema.partial();
