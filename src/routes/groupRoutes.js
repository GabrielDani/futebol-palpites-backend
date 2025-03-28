import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import GroupController from "../controllers/GroupController.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import { createGroupSchema, idSchema } from "../validations/groupValidation.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  validateSchema(createGroupSchema),
  GroupController.createGroup
);

router.get("/", GroupController.getAllGroups);

router.post(
  "/join/:groupId",
  validateSchema(idSchema, "params"),
  GroupController.joinGroup
);

router.post(
  "/leave/:groupId",
  validateSchema(idSchema, "params"),
  GroupController.leaveGroup
);

router.delete(
  "/:groupId",
  validateSchema(idSchema, "params"),
  GroupController.deleteGroup
);

export default router;
