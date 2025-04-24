import { guessToDTO } from "../dtos/guessDTO.js";
import prisma from "../repositories/prisma.js";
import { UnauthorizedError, NotFoundError } from "../utils/customErrors.js";
import { handlePrismaError } from "../utils/prismaErrorHandler.js";

class GuessService {
  findGuesses = async () => {
    try {
      const guesses = await prisma.guess.findMany({
        include: {
          user: { select: { nickname: true } },
          match: { include: { homeTeam: true, awayTeam: true } },
        },
      });
      return guesses.map(guessToDTO);
    } catch (error) {
      handlePrismaError(error);
    }
  };

  findMyGuesses = async (userId) => {
    try {
      console.log(
        `[GuessService][findMyGuesses] Buscando palpites do usuário ${userId}...`
      );

      return await prisma.$transaction(async (tx) => {
        const guesses = await tx.guess.findMany({
          where: { userId },
          select: {
            matchId: true,
            scoreHome: true,
            scoreAway: true,
          },
        });

        const guessesMap = new Map(
          guesses.map((guess) => [guess.matchId, guess])
        );

        const matches = await tx.match.findMany({
          include: {
            homeTeam: true,
            awayTeam: true,
          },
          orderBy: [{ date: "asc" }, { round: "asc" }],
        });

        const result = matches.map((match) => {
          const guess = guessesMap.get(match.id);

          return {
            match: {
              id: match.id,
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              date: match.date,
              status: match.status,
              round: match.round,
              scoreHome: match.scoreHome,
              scoreAway: match.scoreAway,
            },
            guess: guess
              ? {
                  scoreHome: guess.scoreHome,
                  scoreAway: guess.scoreAway,
                }
              : null,
          };
        });

        console.log(
          `[GuessService][findMyGuesses] Resultado combinado para usuário ${userId}:`,
          result
        );
        return result;
      });
    } catch (error) {
      console.error(
        `[GuessService][findMyGuesses] Erro ao buscar palpites do usuário ${userId}:`,
        error
      );
      throw error;
    }
  };

  createOrUpdateGuess = async (userId, guesses) => {
    console.log("[GuessService][createOrUpdateGuess] Guesses:", guesses);
    return await prisma.$transaction(async (tx) => {
      let createdCount = 0;
      let updatedCount = 0;

      for (const guess of guesses) {
        const existingGuess = await tx.guess.findUnique({
          where: {
            userId_matchId: {
              userId,
              matchId: guess.matchId,
            },
          },
        });

        if (existingGuess) {
          await tx.guess.update({
            where: {
              userId_matchId: {
                userId,
                matchId: guess.matchId,
              },
            },
            data: {
              scoreHome: guess.scoreHome,
              scoreAway: guess.scoreAway,
            },
          });
          updatedCount++;
        } else {
          await tx.guess.create({
            data: {
              userId,
              matchId: guess.matchId,
              scoreHome: guess.scoreHome,
              scoreAway: guess.scoreAway,
            },
          });
          createdCount++;
        }
      }

      return { createdCount, updatedCount };
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
        handlePrismaError(error);
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
