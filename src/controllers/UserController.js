import UserService from "../services/UserService.js";
import { createUserSchema } from "../validations/userValidation.js";

class UserController {
  async createUser(req, res) {
    const validation = createUserSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ error: validation.error.format() });
    }

    try {
      const user = await UserService.createUser(
        req.body.nickname,
        req.body.password
      );
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserByNickname(req, res) {
    const { nickname } = req.params;

    try {
      const user = await UserService.findUserByNickname(nickname);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "Usuário não encontrado " });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateUser(req, res) {
    const { id } = req.params;
    const { nickname, password } = req.body;

    try {
      const updateUser = await UserService.updateUser(id, {
        nickname,
        password,
      });

      res.status(200).json(updateUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;

    try {
      await UserService.deleteUser(id);
      res.status(204).json();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new UserController();
