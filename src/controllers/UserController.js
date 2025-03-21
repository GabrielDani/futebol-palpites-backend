import UserService from "../services/UserService.js";
import { BadRequestError, NotFoundError } from "../utils/customErrors.js";
import {
  createUserSchema,
  nicknameUserSchema,
  updateUserSchema,
  uuidUserSchema,
} from "../validations/userValidation.js";
import { formatZodError } from "../utils/validationUtils.js";

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  async findUserById(req, res, next) {
    const { id } = req.params;

    const idValidation = uuidUserSchema.safeParse(id);
    if (!idValidation.success)
      return next(new BadRequestError(formatZodError(idValidation.error)));

    try {
      const user = await UserService.findUserById(id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async findUserByNickname(req, res, next) {
    const { nickname } = req.params;

    const validation = nicknameUserSchema.safeParse(nickname);
    if (!validation.success)
      return next(new BadRequestError(formatZodError(validation.error)));

    try {
      const user = await UserService.findUserByNickname(nickname);
      if (!user) return next(new NotFoundError("Usuário não encontrado."));

      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async createUser(req, res, next) {
    const { nickname, password } = req.body;
    const validation = createUserSchema.safeParse(req.body);

    if (!validation.success)
      return next(new BadRequestError(formatZodError(validation.error)));

    try {
      const user = await UserService.createUser(nickname, password);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    const { id } = req.params;
    const idValidation = uuidUserSchema.safeParse(id);
    if (!idValidation.success)
      return next(new BadRequestError(formatZodError(idValidation.error)));

    const { nickname, password } = req.body;
    const validation = updateUserSchema.safeParse(req.body);
    if (!validation.success)
      return next(new BadRequestError(formatZodError(validation.error)));

    try {
      const updateUser = await UserService.updateUser(id, {
        nickname,
        password,
      });

      res.status(200).json(updateUser);
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req, res, next) {
    const { id } = req.params;

    const idValidation = uuidUserSchema.safeParse(id);
    if (!idValidation.success)
      return next(new BadRequestError(formatZodError(idValidation.error)));

    try {
      await UserService.deleteUser(id);
      res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
