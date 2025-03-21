import { Router } from "express";
import AuthController from "../controllers/AuthController.js";

const router = Router();

router.post("/login", AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh", AuthController.refreshToken);

export default router;
