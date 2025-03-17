import prisma from "../repositories/prisma.js";
import { hashPassword } from "../auth/password.js";

class UserService {
  async createUser(nickname, password) {
    const existingUser = await prisma.user.findUnique({ where: { nickname } });
    if (existingUser) {
      throw new Error("Nickname já está em uso.");
    }

    const hashedPassword = await hashPassword(password);

    return prisma.user.create({
      data: {
        nickname,
        password: hashedPassword,
      },
    });
  }

  async findUserByNickname(nickname) {
    return prisma.user.findUnique({
      where: { nickname },
    });
  }

  async getAllUsers() {
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
