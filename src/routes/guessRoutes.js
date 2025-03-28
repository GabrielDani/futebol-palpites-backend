import GuessController from "../controllers/GuessController.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createOrUpdateGuessSchema,
  idSchema,
} from "../validations/guessValidation.js";

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
  validateSchema(idSchema, "params"),
  GuessController.deleteGuess
);

export default router;
