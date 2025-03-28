import UserService from "../services/UserService.js";

class UserController {
  profile = async (req, res, next) => {
    try {
      const user = await UserService.profile(req.user);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req, res, next) => {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  findUserById = async (req, res, next) => {
    try {
      const user = await UserService.findUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  findUserByNickname = async (req, res, next) => {
    try {
      const user = await UserService.findUserByNickname(req.params.nickname);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  findUserGroups = async (req, res, next) => {
    try {
      const groups = await UserService.findUserGroups(req.user.id);
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  };

  findUserGuesses = async (req, res, next) => {
    try {
      const guesses = await UserService.findUserGuesses(req.user.id);
      res.status(200).json(guesses);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req, res, next) => {
    try {
      const user = await UserService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const updateUser = await UserService.updateUser(req.body, req.user);
      res.status(200).json(updateUser);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      await UserService.deleteUser(req.params.id, req.user);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
