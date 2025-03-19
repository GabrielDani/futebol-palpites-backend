import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import GroupController from "../controllers/GroupController.js";

const router = Router();

router.use(authMiddleware);

router.post("/", GroupController.createGroup);
router.get("/", GroupController.getAllGroups);
router.post("/:groupId/join", GroupController.joinGroup);
router.post("/:groupId/leave", GroupController.leaveGroup);
router.delete("/:groupId", GroupController.deleteGroup);

export default router;
