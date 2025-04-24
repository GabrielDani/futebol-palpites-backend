import prisma from "../repositories/prisma.js";
import { hashPassword } from "../auth/password.js";
import { groupsToDTO, guessesToDTO, userToDTO } from "../dtos/userDTO.js";
import { handlePrismaError } from "../utils/prismaErrorHandler.js";
import { UnauthorizedError } from "../utils/customErrors.js";

class UserService {
  me = async (userInfo) => {
    try {
      const user = await prisma.user.findFirstOrThrow({
        where: { id: userInfo.id },
      });
      return userToDTO(user);
    } catch (error) {
      handlePrismaError(error);
    }
  };

  profile = async (userInfo) => {
    try {
      return await prisma.user.findUniqueOrThrow({
        where: { id: userInfo.id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  };

  getAllUsers = async () => {
    try {
      const users = await prisma.user.findMany();
      return users.map(userToDTO);
    } catch (error) {
      handlePrismaError(error);
    }
  };

  findUserById = async (id) => {
    try {
      const user = await prisma.user.findUniqueOrThrow({ where: { id } });
      return userToDTO(user);
    } catch (error) {
      console.log(error);
      handlePrismaError(error);
    }
  };

  findUserByNickname = async (nickname) => {
    try {
      const user = await prisma.user.findUniqueOrThrow({ where: { nickname } });
      return userToDTO(user);
    } catch (error) {
      handlePrismaError(error);
    }
  };

  findUserGroups = async (id) => {
    try {
      const groups = await prisma.user.findUniqueOrThrow({
        where: { id },
        include: {
          groups: {
            include: {
              group: {
                include: {
                  creator: { select: { nickname: true } },
                  _count: { select: { members: true } },
                },
              },
            },
          },
        },
      });
      return groupsToDTO(groups);
    } catch (error) {
      handlePrismaError(error);
    }
  };

  findUserGuesses = async (id) => {
    try {
      const guesses = await prisma.user.findUniqueOrThrow({
        where: { id },
        include: {
          guesses: {
            include: { match: { include: { homeTeam: true, awayTeam: true } } },
          },
        },
      });
      return guessesToDTO(guesses);
    } catch (error) {
      handlePrismaError(error);
    }
  };

  createUser = async (data) => {
    try {
      const hashedPassword = await hashPassword(data.password);

      const user = await prisma.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
      });

      return userToDTO(user);
    } catch (error) {
      handlePrismaError(error);
    }
  };

  updateUser = async (newData, userInfo) => {
    this.#verifyPermissionToModify(userInfo);

    const data = newData.password
      ? { ...newData, password: await hashPassword(newData.password) }
      : newData;

    try {
      const updateUser = await prisma.user.update({
        where: { id: userInfo.id },
        data,
      });

      return userToDTO(updateUser);
    } catch (error) {
      handlePrismaError(error);
    }
  };

  deleteUser = async (id, userInfo) => {
    this.#verifyPermissionToModify(userInfo);

    try {
      return await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      handlePrismaError(error);
    }
  };

  findUser = async (whereClause) => {
    try {
      return await prisma.user.findUniqueOrThrow({ where: whereClause });
    } catch (error) {
      handlePrismaError(error);
    }
  };

  #verifyPermissionToModify = (userInfo) => {
    const { id, role } = userInfo;
    if (!id && role !== "ADMIN")
      throw new UnauthorizedError("Você não pode modificar este usuário.");
  };
}

export default new UserService();
