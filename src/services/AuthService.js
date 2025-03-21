import prisma from "../repositories/prisma.js";
import { comparePassword } from "../auth/password.js";
import { generateToken } from "../auth/jwt.js";
import { NotFoundError, UnauthorizedError } from "../utils/customErrors.js";

class AuthService {
  async login(nickname, password) {
    const user = await prisma.user.findUnique({ where: { nickname } });

    if (!user) throw new NotFoundError("Usuário não encontrado.");

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError("Senha inválida.");
    }

    return generateToken({
      id: user.id,
      nickname: user.nickname,
      role: user.role,
    });
  }
}

export default new AuthService();
