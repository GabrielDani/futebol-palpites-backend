import prisma from "../repositories/prisma.js";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "../utils/customErrors.js";

class TeamService {
  getAllTeams = async () => {
    return await prisma.team.findMany({ orderBy: { id: "asc" } });
  };

  findById = async (id) => {
    return await this.#findTeamOrFail({ id });
  };

  findTeamByName = async (name) => {
    return await this.#findTeamOrFail({ name });
  };

  createTeam = async (data) => {
    try {
      return await prisma.team.create({
        data,
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictError("Nome do time já existe.");
      }
      throw new InternalServerError("Erro ao criar time.");
    }
  };

  updateTeam = async (id, data) => {
    await this.#findTeamOrFail({ id });
    return await prisma.team.update({ where: { id }, data });
  };

  deleteTeam = async (id) => {
    await this.#findTeamOrFail({ id });
    return await prisma.team.delete({ where: { id } });
  };

  #findTeamOrFail = async (whereClause) => {
    const team = await prisma.team.findUnique({ where: whereClause });
    if (!team) throw new NotFoundError("Time não encontrado.");
    return team;
  };
}

export default new TeamService();
