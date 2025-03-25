import prisma from "../repositories/prisma.js";
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/customErrors.js";

class GroupService {
  createGroup = async (name, isPublic, userId) => {
    try {
      const group = await prisma.group.create({
        data: {
          name,
          isPublic,
          createdBy: userId,
        },
      });

      await prisma.userGroup.create({ data: { userId, groupId: group.id } });

      return group;
    } catch (error) {
      throw new InternalServerError("Erro ao criar grupo.");
    }
  };

  getAllGroups = async (userId) => {
    return await prisma.group.findMany({
      where: {
        OR: [{ isPublic: true }, { members: { some: { userId } } }],
      },
      select: {
        id: true,
        name: true,
        isPublic: true,
        createdAt: true,
        _count: { select: { members: true } },
      },
    });
  };

  joinGroup = async (groupId, userId) => {
    const group = await this.#findGroupByIdOrFail(groupId);
    if (!group.isPublic)
      throw new UnauthorizedError(
        "Ainda não implementado entrada para grupos privados."
      );

    const isMember = await this.#isMember(userId, groupId);
    if (isMember) throw new ConflictError("Usuário já está no grupo.");

    return await prisma.userGroup.create({ data: { userId, groupId } });
  };

  leaveGroup = async (groupId, userId) => {
    const isMember = await this.#isMember(userId, groupId);
    if (!isMember) throw new UnauthorizedError("Usuário não está nesse grupo.");

    return await prisma.userGroup.delete({
      where: { userId_groupId: { userId, groupId } },
    });
  };

  deleteGroup = async (groupId, userId) => {
    const group = await this.#findGroupByIdOrFail(groupId);
    if (group.createdBy !== userId)
      throw new UnauthorizedError("Apenas o criador pode excluir o grupo.");

    await prisma.userGroup.deleteMany({ where: { groupId } });
    return await prisma.group.delete({ where: { id: groupId } });
  };

  #findGroupByIdOrFail = async (id) => {
    const group = await prisma.group.findUnique({ where: { id } });
    if (!group) throw new NotFoundError("Grupo não encontrado.");
    return group;
  };

  #isMember = async (userId, groupId) => {
    const isMember = await prisma.userGroup.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });
    return !!isMember;
  };
}

export default new GroupService();
