import UserService from "../services/UserService.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../utils/customErrors.js";
import {
  createUserSchema,
  nicknameUserSchema,
  updateUserSchema,
  uuidUserSchema,
} from "../validations/userValidation.js";
import { formatZodError } from "../utils/validationUtils.js";
import { hashPassword } from "../auth/password.js";

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
      res.status(200).json(user);
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
      if (!user) return next(new NotFoundError("Usuário não encontrado"));

      res.status(200).json(user);
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

    const validation = updateUserSchema.safeParse(req.body);
    if (!validation.success)
      return next(new BadRequestError(formatZodError(validation.error)));

    try {
      const userIdFromToken = req.user.id;
      const userRole = req.user.role;

      if (userIdFromToken !== id && userRole !== "ADMIN")
        return next(
          new ForbiddenError("Você não tem permissão para esta ação")
        );

      const data = req.body;

      if (data.password) data.password = await hashPassword(data.password);
      const updateUser = await UserService.updateUser(id, data);

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
      const userIdFromToken = req.user.id;
      const userRole = req.user.role;

      if (userIdFromToken !== id && userRole !== "ADMIN")
        return next(
          new ForbiddenError("Você não tem permissão para esta ação")
        );
      await UserService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
