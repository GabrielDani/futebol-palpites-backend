import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import { loginSchema } from "../validations/authValidation.js";

const router = Router();

router.post("/login", validateSchema(loginSchema), AuthController.login);
router.post("/logout", AuthController.logout);
router.post("/refresh", AuthController.refreshToken);

export default router;
