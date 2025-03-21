import AuthService from "../services/AuthService.js";
import UserService from "../services/UserService.js";
import { loginSchema } from "../validations/authValidation.js";
import { BadRequestError, UnauthorizedError } from "../utils/customErrors.js";
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

  async refreshToken(req, res, next) {
    const { refreshToken } = req.body;

    if (!refreshToken) return next(new UnauthorizedError("Token inválido."));

    try {
      const decoded = verifyToken(refreshToken);
      const user = await UserService.findUserByIdWithoutDTO(decoded.id);
      console.log(user);

      const newAccessToken = generateAccessToken(user);

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      next(new UnauthorizedError("Refresh token inválido."));
    }
  }
}

export default new AuthController();
