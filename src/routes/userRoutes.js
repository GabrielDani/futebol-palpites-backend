import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import UserController from "../controllers/UserController.js";

const router = Router();

router.post("/", UserController.createUser);
router.get("/", authMiddleware, UserController.getAllUsers);
router.get("/id/:id", UserController.findUserById);
router.get("/nickname/:nickname", UserController.findUserByNickname);
router.put("/:id", authMiddleware, UserController.updateUser);
router.delete("/:id", authMiddleware, UserController.deleteUser);

export default router;
