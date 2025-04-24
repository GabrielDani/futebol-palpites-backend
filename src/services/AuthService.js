import prisma from "../repositories/prisma.js";
import { comparePassword } from "../auth/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../auth/jwt.js";
import { NotFoundError, UnauthorizedError } from "../utils/customErrors.js";
import { userToDTO } from "../dtos/userDTO.js";

class AuthService {
  login = async (nickname, password) => {
    return await prisma.$transaction(async (tx) => {
      let user = await this.#findUser(tx, { nickname });
      await this.#verifyPassword(user, password);
      const token = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user.id);

      user = userToDTO(user);
      return { token, refreshToken, user };
    });
  };

  logout = async (refreshToken) => {
    try {
      verifyToken(refreshToken);
      await prisma.revokedToken.create({ data: { token: refreshToken } });
    } catch (error) {
      throw new UnauthorizedError("Refresh token inválido ou expirado.");
    }
  };

  isTokenRevoked = async (token) => {
    const revoked = await prisma.revokedToken.findUnique({ where: { token } });
    return !!revoked;
  };

  #findUser = async (tx, whereClause) => {
    const user = await tx.user.findUnique({ where: whereClause });
    if (!user) throw new NotFoundError("Usuário não encontrado.");
    return user;
  };

  #verifyPassword = async (user, password) => {
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError("Senha inválida.");
  };
}

export default new AuthService();
