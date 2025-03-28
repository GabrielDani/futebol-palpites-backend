import { Router } from "express";
import UserController from "../controllers/UserController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import {
  idSchema,
  createSchema,
  updateSchema,
  nicknameSchema,
} from "../validations/userValidation.js";

const router = Router();

router.get("/profile", authMiddleware, UserController.profile);

router.get("/", authMiddleware, UserController.getAllUsers);

router.get(
  "/find/id/:id",
  validateSchema(idSchema, "params"),
  UserController.findUserById
);

router.get(
  "/find/nickname/:nickname",
  validateSchema(nicknameSchema, "params"),
  UserController.findUserByNickname
);

router.get("/groups", authMiddleware, UserController.findUserGroups);

router.get("/guesses", authMiddleware, UserController.findUserGuesses);

router.post("/", validateSchema(createSchema), UserController.createUser);

router.put(
  "/:id",
  authMiddleware,
  validateSchema(updateSchema),
  UserController.updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  validateSchema(idSchema, "params"),
  UserController.deleteUser
);

export default router;
