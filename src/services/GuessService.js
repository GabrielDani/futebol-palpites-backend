import { guessToDTO } from "../dtos/guessDTO.js";
import prisma from "../repositories/prisma.js";
import { UnauthorizedError, NotFoundError } from "../utils/customErrors.js";

class GuessService {
  findGuesses = async () => {
    const guesses = await prisma.guess.findMany({
      include: {
        user: { select: { nickname: true } },
        match: { include: { homeTeam: true, awayTeam: true } },
      },
    });
    return guesses.map(guessToDTO);
  };

  createOrUpdateGuess = async (userId, data) => {
    return await prisma.$transaction(async (tx) => {
      await this.#validateMatchStatus(tx, data.matchId);
      return await tx.guess.upsert({
        where: { userId_matchId: { userId, matchId: data.matchId } },
        update: data,
        create: { ...data, userId },
      });
    });
  };

  deleteGuess = async (userId, matchId) => {
    return await prisma.$transaction(async (tx) => {
      await this.#validateMatchStatus(tx, matchId);

      try {
        return await tx.guess.delete({
          where: { userId_matchId: { userId, matchId } },
        });
      } catch (error) {
        throw new NotFoundError("Palpite não encontrado.");
      }
    });
  };

  #validateMatchStatus = async (tx, matchId) => {
    const match = await tx.match.findUnique({
      where: { id: matchId },
    });
    if (!match) throw new NotFoundError("Partida não encontrada.");
    if (match.status !== "PENDING")
      throw new UnauthorizedError(
        "Não é permitido palpites após início da partida."
      );

    return true;
  };
}

export default new GuessService();
