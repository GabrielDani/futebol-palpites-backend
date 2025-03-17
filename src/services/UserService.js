import prisma from "../repositories/prisma.js";

class UserService {
  async createUser(nickname, password) {
    return prisma.user.create({
      data: {
        nickname,
        password,
      },
    });
  }

  async findUserByNickname(nickname) {
    return prisma.user.findUnique({
      where: { nickname },
    });
  }

  async gettAllUsers() {
    return prisma.user.findMany();
  }

  async updateUser(id, data) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id) {
    return prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserService();
