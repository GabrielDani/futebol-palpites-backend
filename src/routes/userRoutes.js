import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import UserController from "../controllers/UserController.js";

const router = Router();

router.post("/", UserController.createUser);
router.get("/", authMiddleware, UserController.getAllUsers);
router.get("/:nickname", UserController.getUserByNickname);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
