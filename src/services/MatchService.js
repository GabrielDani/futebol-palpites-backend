import { matchToDTO } from "../dtos/matchDTO.js";
import prisma from "../repositories/prisma.js";
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "../utils/customErrors.js";
import { handlePrismaError } from "../utils/prismaErrorHandler.js";

class MatchService {
  getAllMatches = async () => {
    try {
      const matches = await prisma.match.findMany({
        include: { homeTeam: true, awayTeam: true },
        orderBy: { date: "asc" },
      });
      return matches;
    } catch (error) {
      handlePrismaError(error);
    }
  };

  findNextMatches = async (quantity) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const offset = -3 * 60;
        const currentDate = new Date(Date.now() + offset * 60 * 1000);

        const matches = await tx.match.findMany({
          where: {
            date: {
              gte: currentDate,
            },
          },
          include: {
            homeTeam: true,
            awayTeam: true,
          },
          orderBy: {
            date: "asc",
          },
          take: quantity,
        });

        if (matches.length === 0) {
          console.warn("No upcoming matches found");
        }

        console.log(matches);
        return matches.map(matchToDTO);
      });
    } catch (error) {
      handlePrismaError(error);
    }
  };

  findMatchByRound = async (round) => {
    try {
      const matches = await prisma.$transaction(async (tx) => {
        return await tx.match.findMany({
          where: { round },
          include: { homeTeam: true, awayTeam: true },
          orderBy: { date: "asc" },
        });
      });
      return matches.map(matchToDTO);
    } catch (error) {
      handlePrismaError(error);
    }
  };

  findMatchById = async (id) => {
    try {
      const match = await prisma.match.findUnique({
        where: { id },
        include: { homeTeam: true, awayTeam: true },
      });
      if (!match) throw new NotFoundError("Partida não encontrada.");
      return match;
    } catch (error) {
      throw error;
    }
  };

  getStandings = async () => {
    try {
      return await prisma.$transaction(async (tx) => {
        // Obter todos os times
        const teams = await tx.team.findMany();

        // console.log("[MatchService][getStandings] Times", teams);

        // Obter todas as partidas finalizadas
        const finishedMatches = await tx.match.findMany({
          where: {
            status: "FINISHED",
          },
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        });

        // console.log(
        //   "[MatchService][getStandings] FinishedMatches",
        //   finishedMatches
        // );

        // Inicializar o objeto de estatísticas para cada time
        const standingsMap = teams.reduce((acc, team) => {
          acc[team.id] = {
            team,
            points: 0,
            matches: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
          };
          return acc;
        }, {});

        // console.log("[MatchService][getStandings] StandingsMap", standingsMap);

        // Processar cada partida para calcular as estatísticas
        finishedMatches.forEach((match) => {
          if (match.scoreHome === null || match.scoreAway === null) return;

          const homeTeamStats = standingsMap[match.homeTeamId];
          const awayTeamStats = standingsMap[match.awayTeamId];

          // Atualizar estatísticas básicas
          homeTeamStats.matches++;
          awayTeamStats.matches++;

          homeTeamStats.goalsFor += match.scoreHome;
          homeTeamStats.goalsAgainst += match.scoreAway;

          awayTeamStats.goalsFor += match.scoreAway;
          awayTeamStats.goalsAgainst += match.scoreHome;

          // Calcular resultado da partida
          if (match.scoreHome > match.scoreAway) {
            // Vitória do time da casa
            homeTeamStats.wins++;
            homeTeamStats.points += 3;
            awayTeamStats.losses++;
          } else if (match.scoreHome < match.scoreAway) {
            // Vitória do time visitante
            awayTeamStats.wins++;
            awayTeamStats.points += 3;
            homeTeamStats.losses++;
          } else {
            // Empate
            homeTeamStats.draws++;
            awayTeamStats.draws++;
            homeTeamStats.points += 1;
            awayTeamStats.points += 1;
          }
        });

        // Calcular saldo de gols e converter para array
        const standings = Object.values(standingsMap).map((teamStats) => ({
          ...teamStats,
          goalDifference: teamStats.goalsFor - teamStats.goalsAgainst,
        }));

        // Ordenar a classificação
        standings.sort((a, b) => {
          // Primeiro por pontos
          if (b.points !== a.points) return b.points - a.points;

          // Em caso de empate, por vitórias
          if (b.wins !== a.wins) return b.wins - a.wins;

          // Depois por saldo de gols
          if (b.goalDifference !== a.goalDifference)
            return b.goalDifference - a.goalDifference;

          // Por último por gols marcados
          return b.goalsFor - a.goalsFor;
        });

        // Adicionar a posição
        return standings.map((standing, index) => ({
          position: index + 1,
          team: {
            id: standing.team.id,
            name: standing.team.name,
            logoUrl: standing.team.logoUrl,
          },
          points: standing.points,
          matches: standing.matches,
          wins: standing.wins,
          draws: standing.draws,
          losses: standing.losses,
          goalsFor: standing.goalsFor,
          goalsAgainst: standing.goalsAgainst,
          goalDifference: standing.goalDifference,
        }));
      });
    } catch (error) {
      handlePrismaError(error);
    }
  };

  createMatch = async (data) => {
    try {
      return await prisma.$transaction(async (tx) => {
        await this.#validateTeamsForMatch(tx, data);
        return await tx.match.create({ data });
      });
    } catch (error) {
      throw error;
    }
  };

  updateMatch = async (id, newData) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const match = await tx.match.findUnique({
          where: { id },
          include: {
            homeTeam: true,
            awayTeam: true,
          },
        });

        if (!match) throw new NotFoundError("Partida não encontrada.");

        // Atualiza o status automaticamente baseado na data/horário
        const now = new Date();
        const matchDate = new Date(match.date);
        const status = this.#determineMatchStatus(
          now,
          matchDate,
          newData.scoreHome,
          newData.scoreAway
        );

        // Prepara os dados para atualização
        const updateData = {
          ...newData,
          status: status, // Atualiza o status automaticamente
        };

        // Validação das equipes
        await this.#validateTeamsForMatch(tx, {
          ...match,
          ...updateData,
        });

        return await tx.match.update({
          where: { id },
          data: updateData,
        });
      });
    } catch (error) {
      throw error;
    }
  };

  // Método auxiliar para determinar o status da partida
  #determineMatchStatus = (now, matchDate, scoreHome, scoreAway) => {
    // Se já tem placar definido, considera como FINISHED
    if (scoreHome !== null && scoreAway !== null) {
      return "FINISHED";
    }

    // Se a data da partida já passou, mas não tem placar, considera como ONGOING
    if (now >= matchDate) {
      return "ONGOING";
    }

    // Caso contrário, mantém como PENDING
    return "PENDING";
  };

  deleteMatch = async (id) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const match = await tx.match.findUnique({ where: { id } });
        if (!match) throw new NotFoundError("Partida não encontrada.");
        return await tx.match.delete({ where: { id } });
      });
    } catch (error) {
      throw error;
    }
  };

  #findTeamOrFail = async (tx, teamId) => {
    const team = await tx.team.findUnique({ where: { id: teamId } });
    if (!team) throw new NotFoundError("Time não encontrado.");
    return team;
  };

  #validateTeamsForMatch = async (tx, data) => {
    const { id, homeTeamId, awayTeamId, round } = data;

    await this.#findTeamOrFail(tx, homeTeamId);
    await this.#findTeamOrFail(tx, awayTeamId);

    if (homeTeamId === awayTeamId) {
      throw new BadRequestError("Um time não pode jogar contra ele mesmo.");
    }

    const existingMatch = await tx.match.findFirst({
      where: {
        round,
        OR: [
          { homeTeamId },
          { awayTeamId: homeTeamId },
          { awayTeamId },
          { homeTeamId: awayTeamId },
        ],
        NOT: id ? { id } : undefined,
      },
    });

    if (existingMatch) {
      throw new ConflictError(
        "Algum desses times já tem uma partida cadastrada nesta rodada."
      );
    }
  };
}

export default new MatchService();
