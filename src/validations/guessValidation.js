import { z } from "zod";
import { createFieldSchema } from "../utils/baseSchema.js";

export const guessSchema = z.object({
  matchId: createFieldSchema.uuid("matchId"),
  scoreHome: createFieldSchema.positiveInt("scoreHome", { min: 0, max: 10 }),
  scoreAway: createFieldSchema.positiveInt("scoreAway", { min: 0, max: 10 }),
});

export const idSchema = z.object({
  matchId: createFieldSchema.uuid("ID"),
});

export const createOrUpdateGuessSchema = z
  .array(guessSchema)
  .nonempty({
    message: "É necessário enviar pelo menos um palpite",
  })
  .refine(
    (guesses) => {
      // Verifica se há IDs de partida duplicados
      const matchIds = guesses.map((g) => g.matchId);
      return new Set(matchIds).size === matchIds.length;
    },
    {
      message: "Não podem existir palpites duplicados para a mesma partida",
    }
  );
