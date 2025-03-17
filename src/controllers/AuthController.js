import AuthService from "../services/AuthService.js";
import { loginSchema } from "../validations/authValidation.js";

class AuthController {
  async login(req, res) {
    const { nickname, password } = req.body;

    const validation = loginSchema.safeParse({ nickname, password });
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    try {
      const token = await AuthService.login(nickname, password);
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }
}

export default new AuthController();
