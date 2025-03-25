import GuessController from "../controllers/GuessController.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createOrUpdateGuessSchema } from "../validations/guessValidation.js";
import { uuidSchema } from "../validations/generalValidation.js";

const router = new Router();

router.use(authMiddleware);

router.get("/", GuessController.findGuesses);
router.post(
  "/",
  validateSchema(createOrUpdateGuessSchema),
  GuessController.createOrUpdateGuess
);
router.delete(
  "/:matchId",
  validateSchema(uuidSchema, "params"),
  GuessController.deleteGuess
);

export default router;
