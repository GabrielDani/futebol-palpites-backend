import UserService from "../services/UserService.js";

class UserController {
  async createUser(req, res) {
    const { nickname, password } = req.body;

    try {
      const user = await UserService.createUser(nickname, password);
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  async getUserByNickname(req, res) {
    const { nickname } = req.params;

    try {
      const user = await UserService.findUserByNickname(nickname);
      if (user) {
        res.status(200).send(user);
      } else {
        res.status(400).send({ error: "Usuário não encontrado " });
      }
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await UserService.gettAllUsers();
      res.status(200).send(users);
    } catch (error) {
      res.status(400).send({ error: error.message });
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

      res.status(200).send(updateUser);
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;

    try {
      await UserService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
  }
}

export default new UserController();
