import prisma from "../repositories/prisma.js";
import { ConflictError, NotFoundError } from "../utils/customErrors.js";

class TeamService {
  async getAllTeams() {
    return prisma.team.findMany();
  }

  async findById(id) {
    return prisma.team.findUnique({ where: { id } });
  }

  async findTeamByName(name) {
    return prisma.team.findUnique({ where: { name } });
  }

  async createTeam(name, shortName, logoUrl) {
    try {
      return await prisma.team.create({
        data: { name, shortName, logoUrl },
      });
    } catch (error) {
      if (error.code === "P2002") {
        throw new ConflictError("Nome do time já existe.");
      }
      throw error;
    }
  }

  async updateTeam(id, data) {
    const team = await this.findById(id);
    if (!team) throw new NotFoundError("Time não encontrado");
    return prisma.team.update({ where: { id }, data });
  }

  async deleteTeam(id) {
    const team = await this.findById(id);
    if (!team) throw new NotFoundError("Time não encontrado.");
    return prisma.team.delete({ where: { id } });
  }
}

export default new TeamService();
