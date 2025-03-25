import prisma from "../repositories/prisma.js";
import { comparePassword } from "../auth/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../auth/jwt.js";
import { NotFoundError, UnauthorizedError } from "../utils/customErrors.js";

class AuthService {
  login = async (nickname, password) => {
    const user = await this.#findUserByNickname(nickname);
    await this.#verifyPassword(user, password);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);

    return { accessToken, refreshToken };
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

  #findUserByNickname = async (nickname) => {
    const user = await prisma.user.findUnique({ where: { nickname } });
    if (!user) throw new NotFoundError("Usuário não encontrado.");
    return user;
  };

  #verifyPassword = async (user, password) => {
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError("Senha inválida");
  };
}

export default new AuthService();
