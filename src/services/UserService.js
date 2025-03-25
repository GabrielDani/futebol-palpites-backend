import prisma from "../repositories/prisma.js";
import { hashPassword } from "../auth/password.js";
import { userToDTO } from "../dtos/userDTO.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/customErrors.js";

class UserService {
  getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users.map(userToDTO);
  };

  findUserById = async (id) => {
    const user = await this.#findUserOrFail({ id });
    return userToDTO(user);
  };

  findUserByNickname = async (nickname) => {
    const user = await this.#findUserOrFail({ nickname });
    return userToDTO(user);
  };

  createUser = async (data) => {
    const { nickname, password } = data;
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
  };

  updateUser = async (id, newData, userInfo) => {
    this.#verifyPermissionToModify(id, userInfo);

    if (newData.nickname)
      await this.#verifyNicknameAvailability(newData.nickname);

    const data = newData.password
      ? { ...newData, password: await hashPassword(newData.password) }
      : newData;

    const updateUser = await prisma.user.update({
      where: { id },
      data,
    });

    return userToDTO(updateUser);
  };

  deleteUser = async (id, userInfo) => {
    await this.#findUserOrFail({ id });
    this.#verifyPermissionToModify(id, userInfo);

    return await prisma.user.delete({
      where: { id },
    });
  };

  findUserByIdWithoutDTO = async (id) => {
    return await this.#findUserOrFail({ id });
  };

  #findUserOrFail = async (whereClause) => {
    const user = await prisma.user.findUnique({ where: whereClause });
    if (!user) throw new NotFoundError("Usuário não encontrado.");
    return user;
  };

  async #verifyNicknameAvailability(nickname) {
    const existingUser = await prisma.user.findUnique({ where: { nickname } });
    if (existingUser) throw new ConflictError("Nickname já está em uso.");
  }

  #verifyPermissionToModify = (id, userInfo) => {
    const { idFromToken, role } = userInfo;
    if (id !== idFromToken && role !== "ADMIN")
      throw new UnauthorizedError("Você não pode modificar este usuário.");
  };
}

export default new UserService();
