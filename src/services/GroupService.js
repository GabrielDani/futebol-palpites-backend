import prisma from "../repositories/prisma.js";
import { handlePrismaError } from "../utils/prismaErrorHandler.js";
import { NotFoundError, UnauthorizedError } from "../utils/customErrors.js";

class GroupService {
  getAllGroups = async (userId) => {
    try {
      return await prisma.group.findMany({
        where: {
          OR: [{ isPublic: true }, { members: { some: { userId } } }],
        },
        select: {
          id: true,
          name: true,
          isPublic: true,
          creator: {
            select: {
              nickname: true,
            },
          },
          _count: { select: { members: true } },
        },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  };

  getMyGroups = async (userId) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const groups = await tx.group.findMany({
          where: {
            members: {
              some: {
                userId: userId,
              },
            },
          },
          include: {
            creator: {
              select: {
                id: true,
                nickname: true,
              },
            },
            members: {
              select: {
                userId: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        // Mapear o resultado para o tipo Group
        return groups.map((group) => ({
          id: group.id,
          name: group.name,
          isPublic: group.isPublic,
          memberCount: group.members.length,
          createdAt: group.createdAt.toISOString(),
          createdBy: {
            id: group.creator.id,
            nickname: group.creator.nickname,
          },
        }));
      });
    } catch (error) {
      console.error("[GroupService][getMyGroups]", error);
      handlePrismaError(error);
    }
  };

  getPublicGroups = async () => {
    try {
      return await prisma.$transaction(async (tx) => {
        const groups = await tx.group.findMany({
          where: { isPublic: true },
          include: {
            creator: {
              select: {
                id: true,
                nickname: true,
              },
            },
            members: {
              select: {
                userId: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        // Mapear o resultado para o tipo Group
        return groups.map((group) => ({
          id: group.id,
          name: group.name,
          isPublic: group.isPublic,
          memberCount: group.members.length,
          createdAt: group.createdAt.toISOString(),
          createdBy: {
            id: group.creator.id,
            nickname: group.creator.nickname,
          },
        }));
      });
    } catch (error) {
      console.error("[GroupService][getPublicGroups]", error);
      handlePrismaError(error);
    }
  };

  getPrivateGroups = async () => {
    try {
      return await prisma.$transaction(async (tx) => {
        const groups = await tx.group.findMany({
          where: { isPublic: false },
          include: {
            creator: {
              select: {
                id: true,
                nickname: true,
              },
            },
            members: {
              select: {
                userId: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        // Mapear o resultado para o tipo Group
        return groups.map((group) => ({
          id: group.id,
          name: group.name,
          isPublic: group.isPublic,
          memberCount: group.members.length,
          createdAt: group.createdAt.toISOString(),
          createdBy: {
            id: group.creator.id,
            nickname: group.creator.nickname,
          },
        }));
      });
    } catch (error) {
      console.error("[GroupService][getPublicGroups]", error);
      handlePrismaError(error);
    }
  };

  getGroupDetails = async (groupId) => {
    return await prisma.$transaction(async (tx) => {
      const group = await tx.group.findUnique({
        where: { id: groupId },
        include: {
          creator: { select: { id: true, nickname: true } },
          members: {
            select: {
              user: { select: { id: true, nickname: true } },
            },
          },
        },
      });

      if (!group) throw new Error("Grupo não encontrado");

      const memberIds = group.members.map((m) => m.user.id);

      const guesses = await tx.guess.findMany({
        where: {
          userId: { in: memberIds },
          match: { status: "FINISHED" },
        },
        include: {
          user: { select: { id: true, nickname: true } },
          match: {
            select: {
              id: true,
              scoreHome: true,
              scoreAway: true,
              homeTeam: { select: { name: true } },
              awayTeam: { select: { name: true } },
              date: true,
            },
          },
        },
      });

      const userStatsMap = new Map();
      group.members.forEach((m) => {
        userStatsMap.set(m.user.id, {
          user: { id: m.user.id, nickname: m.user.nickname },
          points: 0,
          position: 0,
          correctPredictions: 0,
          exactHits: 0,
          totalGuesses: 0,
        });
      });

      guesses.forEach((g) => {
        const stats = userStatsMap.get(g.user.id);
        stats.totalGuesses++;

        const aH = g.match.scoreHome;
        const aA = g.match.scoreAway;
        const gH = g.scoreHome;
        const gA = g.scoreAway;

        if (aH === gH && aA === gA) {
          stats.points += 3;
          stats.exactHits++;
          stats.correctPredictions++;
        } else if (Math.sign(aH - aA) === Math.sign(gH - gA)) {
          stats.points += 1;
          stats.correctPredictions++;
        }
      });

      const ranking = Array.from(userStatsMap.values())
        .sort(
          (a, b) =>
            b.points - a.points ||
            a.user.nickname.localeCompare(b.user.nickname)
        )
        .map((u, i) => ({
          user: u.user,
          points: u.points,
          position: i + 1,
          correctPredictions: u.correctPredictions,
          exactHits: u.exactHits,
          totalGuesses: u.totalGuesses,
        }));

      const recentGuesses = guesses
        .sort((a, b) => new Date(b.match.date) - new Date(a.match.date))
        .slice(0, 5)
        .map((g) => {
          const aH = g.match.scoreHome;
          const aA = g.match.scoreAway;
          const gH = g.scoreHome;
          const gA = g.scoreAway;
          let points = 0;

          if (aH === gH && aA === gA) points = 3;
          else if (Math.sign(aH - aA) === Math.sign(gH - gA)) points = 1;

          return {
            matchId: g.match.id,
            homeTeam: g.match.homeTeam.name,
            awayTeam: g.match.awayTeam.name,
            userPrediction: [gH, gA],
            actualResult: [aH, aA],
            pointsEarned: points,
          };
        });

      return {
        id: group.id,
        name: group.name,
        isPublic: group.isPublic,
        createdAt: group.createdAt.toISOString(),
        createdBy: group.creator,
        memberCount: group.members.length,
        members: group.members.map((m) => m.user),
        ranking,
        recentPredictions: recentGuesses,
      };
    });
  };

  createGroup = async (userId, data) => {
    try {
      return await prisma.$transaction(async (tx) => {
        const group = await tx.group.create({
          data: {
            ...data,
            createdBy: userId,
          },
        });

        await tx.userGroup.create({ data: { userId, groupId: group.id } });

        return group;
      });
    } catch (error) {
      handlePrismaError(error);
    }
  };

  joinGroup = async (groupId, userId) => {
    try {
      return await prisma.userGroup.create({ data: { userId, groupId } });
    } catch (error) {
      handlePrismaError(error);
    }
  };

  leaveGroup = async (groupId, userId) => {
    try {
      return await prisma.userGroup.delete({
        where: { userId_groupId: { userId, groupId } },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  };

  deleteGroup = async (groupId, userId) => {
    return await prisma.$transaction(async (tx) => {
      const group = await tx.group.findUnique({ where: { id: groupId } });
      if (!group) throw new NotFoundError("Grupo não encontrado.");
      if (group.createdBy !== userId)
        throw new UnauthorizedError("Apenas o criador pode excluir o grupo.");
      return await tx.group.delete({ where: { id: groupId } });
    });
  };
}

export default new GroupService();
