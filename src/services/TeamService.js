import prisma from "../repositories/prisma.js";

class TeamService {
  async createTeam(name, shortName, logoUrl) {
    const existingTeam = prisma.team.findUnique({ where: { name } });

    if (existingTeam) throw new Error("Nome do time já existe.");

    return prisma.team.create({
      data: {
        name,
        shortName,
        logoUrl,
      },
    });
  }

  async getAllTeams() {
    return prisma.team.findMany();
  }
}

export default new TeamService();
