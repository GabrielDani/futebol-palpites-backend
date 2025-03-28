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
        orderBy: { round: "asc" },
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
      return matchToDTO(match);
    } catch (error) {
      handlePrismaError(error);
    }
  };

  findMatchByTeamId = async (teamId) => {
    await this.#findTeamOrFail(teamId);
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ homeTeamId: teamId }, { awayTeamId: teamId }],
      },
      include: {
        homeTeam: true,
        awayTeam: true,
      },
      orderBy: {
        round: "asc",
      },
    });

    if (matches.length === 0) return [];

    return matches.map(matchToDTO);
  };

  createMatch = async (data) => {
    await this.#validateTeamsForMatch(data);
    return await prisma.match.create({ data });
  };

  updateMatch = async (id, newData) => {
    const match = await this.#findMatchOrFail(id);

    const updatedData = { ...match, ...newData };
    await this.#validateTeamsForMatch(updatedData);

    return await prisma.match.update({ where: { id }, data: newData });
  };

  deleteMatch = async (id) => {
    await this.#findMatchOrFail(id);
    return await prisma.match.delete({ where: { id } });
  };

  #findMatchOrFail = async (id) => {
    const match = await prisma.match.findUnique({
      where: { id },
      include: { homeTeam: true, awayTeam: true },
    });
    if (!match) throw new NotFoundError("Partida não encontrada.");
    return match;
  };

  #findTeamOrFail = async (teamId) => {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) throw new NotFoundError("Time não encontrado.");
    return team;
  };

  #validateTeamsForMatch = async (data) => {
    const { id, homeTeamId, awayTeamId, round } = data;

    await this.#findTeamOrFail(homeTeamId);
    await this.#findTeamOrFail(awayTeamId);

    if (homeTeamId === awayTeamId) {
      throw new BadRequestError("Um time não pode jogar contra ele mesmo.");
    }

    const existingMatch = await prisma.match.findFirst({
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
