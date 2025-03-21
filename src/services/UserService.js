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
    if (!user) throw new NotFoundError("Usuário não encontrado.");
    return userToDTO(user);
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
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("Usuário não encontrado.");

    const updateUser = await prisma.user.update({
      where: { id },
      data,
    });

    return userToDTO(updateUser);
  }

  async deleteUser(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("Usuário não encontrado.");

    return prisma.user.delete({
      where: { id },
    });
  }

  async findUserByIdWithoutDTO(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundError("Usuário não encontrado.");
    return user;
  }
}

export default new UserService();
