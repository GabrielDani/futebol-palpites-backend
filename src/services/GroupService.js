import prisma from "../repositories/prisma.js";

class GroupService {
  async createGroup(name, isPublic, userId) {
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
      throw new Error("Erro ao crar grupo.");
    }
  }

  async getAllGroups(userId) {
    return prisma.group.findMany({
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
  }

  async joinGroup(groupId, userId) {
    const group = await prisma.group.findUnique({ where: { id: groupId } });

    if (!group) throw new Error("Grupo não encontrado.");
    if (!group.isPublic)
      throw new Error("Não é possível entrar em um grupo privado.");

    const alreadyMember = await prisma.userGroup.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });

    if (alreadyMember) throw new Error("Usuário já está no grupo.");

    return prisma.userGroup.create({ data: { userId, groupId } });
  }

  async leaveGroup(groupId, userId) {
    const memberShip = await prisma.userGroup.findUnique({
      where: { userId_groupId: { userId, groupId } },
    });

    if (!memberShip) throw new Error("Usuário não está nesse grupo.");

    return prisma.userGroup.delete({
      where: { userId_groupId: { userId, groupId } },
    });
  }

  async deleteGroup(groupId, userId) {
    const group = await prisma.group.findUnique({ where: { id: groupId } });

    if (!group) throw new Error("Grupo não encontrado.");
    if (group.createdBy !== userId)
      throw new Error("Apenas o criador pode excluir o grupo");

    await prisma.userGroup.deleteMany({ where: { groupId } });

    return prisma.group.delete({ where: { id: groupId } });
  }
}

export default new GroupService();
