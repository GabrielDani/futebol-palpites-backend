import { z } from "zod";

export const uuidMatchSchema = z.string().uuid("O ID deve ser um UUID válido.");

export const createMatchSchema = z.object({
  homeTeamId: z
    .number()
    .int("O ID do time da casa deve ser um número inteiro."),
  awayTeamId: z
    .number()
    .int("O ID do time visitante deve ser um número inteiro."),
  matchDate: z
    .string()
    .datetime("A data da partida deve estar no formato ISO 8601."),
  status: z.enum(["PENDING", "ONGOING", "FINISHED"]),
  round: z.number().int("A rodada deve ser um número inteiro."),
});

export const updateMatchSchema = createMatchSchema.partial();
