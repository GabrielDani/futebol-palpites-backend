import prisma from "../repositories/prisma.js";
import { hashPassword } from "../auth/password.js";
import { userToDTO } from "../dtos/userDTO.js";
import { ConflictError, NotFoundError } from "../utils/customErrors.js";

class UserService {
  async getAllUsers() {
    const users = await prisma.user.findMany();
    return users.map(userToDTO);
  }

  async findUserById(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user ? userToDTO(user) : null;
  }

  async findUserByNickname(nickname) {
    const user = await prisma.user.findUnique({
      where: { nickname },
    });
    return user ? userToDTO(user) : null;
  }

  async createUser(nickname, password) {
    const existingUser = await prisma.user.findUnique({ where: { nickname } });
    if (existingUser) throw new ConflictError("Nickname já está em uso.");

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        nickname,
        password: hashedPassword,
      },
    });

    return userToDTO(user);
  }

  async updateUser(id, data) {
    const user = prisma.user.update({
      where: { id },
      data,
    });
    return userToDTO(user);
  }

  async deleteUser(id) {
    const user = await this.findUserById(id);
    if (!user) throw new NotFoundError("Usuário não encontrado.");

    return prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserService();
