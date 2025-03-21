import AuthService from "../services/AuthService.js";
import { loginSchema } from "../validations/authValidation.js";
import { BadRequestError } from "../utils/customErrors.js";
import { formatZodError } from "../utils/validationUtils.js";

class AuthController {
  async login(req, res, next) {
    const { nickname, password } = req.body;

    const validation = loginSchema.safeParse({ nickname, password });
    if (!validation.success)
      return next(new BadRequestError(formatZodError(validation.error)));

    try {
      const token = await AuthService.login(nickname, password);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
