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
