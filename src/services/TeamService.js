import prisma from "../repositories/prisma.js";
import { handlePrismaError } from "../utils/prismaErrorHandler.js";
import { NotFoundError } from "../utils/customErrors.js";
import { teamToDTO } from "../dtos/teamDTO.js";

class TeamService {
  async getAllTeams() {
    return await prisma.team.findMany({ orderBy: { id: "asc" } });
  }

  async findById(id) {
    return await this.#findTeamOrFail({ id });
  }

  async findTeamByName(name) {
    return await this.#findTeamOrFail({ name });
  }

  async createTeam(data) {
    try {
      return await prisma.team.create({ data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async updateTeam(id, data) {
    try {
      return await prisma.team.update({ where: { id }, data });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async deleteTeam(id) {
    try {
      return await prisma.team.delete({ where: { id } });
    } catch (error) {
      handlePrismaError(error);
    }
  }

  async #findTeamOrFail(whereClausule) {
    const team = await prisma.team.findUnique({
      where: whereClausule,
      include: {
        homeMatches: { include: { homeTeam: true, awayTeam: true } },
        awayMatches: { include: { homeTeam: true, awayTeam: true } },
      },
    });
    if (!team) throw new NotFoundError("Time não encontrado.");
    return teamToDTO(team);
  }
}

export default new TeamService();
