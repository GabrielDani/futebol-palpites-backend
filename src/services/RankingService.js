import prisma from "../repositories/prisma.js";

class RankingService {
  getRanking = async () => {
    return await prisma.$transaction(async (tx) => {
      // 1. Buscar todos os usuários com seus palpites e informações das partidas finalizadas
      const usersWithGuesses = await tx.user.findMany({
        include: {
          guesses: {
            where: {
              match: {
                status: "FINISHED",
              },
            },
            include: {
              match: {
                select: {
                  scoreHome: true,
                  scoreAway: true,
                },
              },
            },
          },
        },
      });

      // 2. Calcular a pontuação para cada usuário
      const usersWithScores = usersWithGuesses.map((user) => {
        let points = 0;
        let exactHits = 0;
        let correctPredictions = 0;
        let totalGuesses = user.guesses.length;

        user.guesses.forEach((guess) => {
          const actualHome = guess.match?.scoreHome;
          const actualAway = guess.match?.scoreAway;
          const guessedHome = guess.scoreHome;
          const guessedAway = guess.scoreAway;

          // Só calcula se a partida foi finalizada e tem placar
          if (actualHome !== null && actualAway !== null) {
            // Acerto exato (3 pontos)
            if (actualHome === guessedHome && actualAway === guessedAway) {
              points += 3;
              exactHits++;
            }
            // Acerto do resultado (1 ponto)
            else if (
              Math.sign(actualHome - actualAway) ===
              Math.sign(guessedHome - guessedAway)
            ) {
              points += 1;
              correctPredictions++;
            }
          }
        });

        return {
          user: {
            id: user.id,
            nickname: user.nickname,
          },
          points,
          exactHits,
          correctPredictions,
          totalGuesses,
        };
      });

      // 3. Ordenar por pontuação (decrescente) e nickname (crescente)
      const sortedRanking = usersWithScores.sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        return a.user.nickname.localeCompare(b.user.nickname);
      });

      // 4. Adicionar a posição no ranking
      const rankingWithPosition = sortedRanking.map((user, index) => ({
        ...user,
        position: index + 1,
      }));

      return rankingWithPosition;
    });
  };

  getPerformance = async (userId) => {
    return await prisma.$transaction(async (tx) => {
      // Buscar o usuário e seus palpites em partidas finalizadas
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        include: {
          guesses: {
            where: {
              match: {
                status: "FINISHED",
                NOT: {
                  OR: [{ scoreHome: null }, { scoreAway: null }],
                },
              },
            },
            include: {
              match: {
                select: {
                  scoreHome: true,
                  scoreAway: true,
                },
              },
            },
          },
        },
      });

      // Calcular estatísticas
      let points = 0;
      let exactHits = 0;
      let correctPredictions = 0;

      user.guesses.forEach((guess) => {
        const actualHome = guess.match.scoreHome;
        const actualAway = guess.match.scoreAway;
        const guessedHome = guess.scoreHome;
        const guessedAway = guess.scoreAway;

        // Acerto exato (3 pontos)
        if (actualHome === guessedHome && actualAway === guessedAway) {
          points += 3;
          exactHits++;
          correctPredictions++;
        }
        // Acerto do resultado (1 ponto)
        else if (
          Math.sign(actualHome - actualAway) ===
          Math.sign(guessedHome - guessedAway)
        ) {
          points += 1;
          correctPredictions++;
        }
      });

      return {
        user: {
          id: user.id,
          nickname: user.nickname,
        },
        points,
        exactHits,
        correctPredictions,
        totalGuesses: user.guesses.length,
        position: 0,
      };
    });
  };
}

export default new RankingService();
