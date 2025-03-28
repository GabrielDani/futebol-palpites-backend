import AuthService from "../services/AuthService.js";
import UserService from "../services/UserService.js";
import { BadRequestError, UnauthorizedError } from "../utils/customErrors.js";
import { generateAccessToken, verifyToken } from "../auth/jwt.js";

class AuthController {
  login = async (req, res, next) => {
    try {
      const { nickname, password } = req.body;
      const tokens = await AuthService.login(nickname, password);
      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return next(new BadRequestError("Campo refreshToken não definido."));

    try {
      await AuthService.logout(refreshToken);
      res.status(200).json({ message: "Logout realizado com sucesso." });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return next(new BadRequestError("Campo refreshToken não definido."));

    try {
      const decoded = verifyToken(refreshToken);

      if (await AuthService.isTokenRevoked(refreshToken))
        return next(
          new UnauthorizedError("Token revogado. Faça login novamente.")
        );

      const user = await UserService.findUserByIdWithoutDTO(decoded.id);
      const newAccessToken = generateAccessToken(user);

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      next(new UnauthorizedError("Refresh token inválido."));
    }
  };
}

export default new AuthController();
