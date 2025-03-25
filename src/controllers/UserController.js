import UserService from "../services/UserService.js";
import {
  createUserSchema,
  nicknameUserSchema,
  updateUserSchema,
  uuidUserSchema,
} from "../validations/userValidation.js";
import { checkSchema, formatZodError } from "../utils/validationUtils.js";

class UserController {
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
      const id = checkSchema(req.params.id, uuidUserSchema);
      const user = await UserService.findUserById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  findUserByNickname = async (req, res, next) => {
    try {
      const nickname = checkSchema(req.params.nickname, nicknameUserSchema);
      const user = await UserService.findUserByNickname(nickname);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req, res, next) => {
    try {
      const data = checkSchema(req.body, createUserSchema);
      const user = await UserService.createUser(data);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const id = checkSchema(req.params.id, uuidUserSchema);
      const newData = checkSchema(req.body, updateUserSchema);
      const userInfo = { idFromToken: req.user.id, role: req.user.role };
      const updateUser = await UserService.updateUser(id, newData, userInfo);
      res.status(200).json(updateUser);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const id = checkSchema(req.params.id, uuidUserSchema);
      const userInfo = { idFromToken: req.user.id, role: req.user.role };
      await UserService.deleteUser(id, userInfo);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
