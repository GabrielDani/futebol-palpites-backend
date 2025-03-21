import AuthService from "../services/AuthService.js";
import UserService from "../services/UserService.js";
import { loginSchema } from "../validations/authValidation.js";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "../utils/customErrors.js";
import { formatZodError } from "../utils/validationUtils.js";
import { generateAccessToken, verifyToken } from "../auth/jwt.js";

class AuthController {
  async login(req, res, next) {
    const { nickname, password } = req.body;

    const validation = loginSchema.safeParse({ nickname, password });
    if (!validation.success)
      return next(new BadRequestError(formatZodError(validation.error)));

    try {
      const tokens = await AuthService.login(nickname, password);
      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res, next) {
    const { refreshToken } = req.body;
    if (!refreshToken) return next(new BadRequestError("Token inválido."));

    try {
      await AuthService.logout(refreshToken);
      res.status(200).json({ message: "Logout realizado com sucesso. " });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    const { refreshToken } = req.body;

    if (!refreshToken) return next(new UnauthorizedError("Token inválido."));

    try {
      const decoded = verifyToken(refreshToken);

      const user = await UserService.findUserByIdWithoutDTO(decoded.id);
      if (!user) return next(new NotFoundError("Usuário não encontrado."));

      if (await AuthService.isTokenRevoked(refreshToken))
        return next(
          new UnauthorizedError("Token revogado. Faça login novamente.")
        );
      const newAccessToken = generateAccessToken(user);

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      next(new UnauthorizedError("Refresh token inválido."));
    }
  }
}

export default new AuthController();
