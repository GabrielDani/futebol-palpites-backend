import prisma from "../repositories/prisma.js";
import { comparePassword } from "../auth/password.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../auth/jwt.js";
import { NotFoundError, UnauthorizedError } from "../utils/customErrors.js";

class AuthService {
  async login(nickname, password) {
    const user = await prisma.user.findUnique({ where: { nickname } });

    if (!user) throw new NotFoundError("Usuário não encontrado.");

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedError("Senha inválida.");

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  async logout(refreshToken) {
    try {
      const decoded = verifyToken(refreshToken);

      const user = await prisma.user.findUnique({ where: { id: decoded.id } });
      if (!user) throw new NotFoundError("Usuário não encontrado.");

      await prisma.revokedToken.create({ data: { token: refreshToken } });
    } catch (error) {
      throw new UnauthorizedError("Refresh token inválido ou expirado.");
    }
  }

  async isTokenRevoked(token) {
    const revoked = await prisma.revokedToken.findUnique({ where: { token } });
    return !!revoked;
  }
}

export default new AuthService();
