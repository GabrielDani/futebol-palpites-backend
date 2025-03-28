import { Router } from "express";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import MatchController from "../controllers/MatchController.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import {
  createMatchSchema,
  idSchema,
  updateMatchSchema,
} from "../validations/matchValidation.js";

const router = Router();

router.use(authMiddleware);

router.get("/", MatchController.getAllMatches);

router.get(
  "/:matchId",
  validateSchema(idSchema, "params"),
  MatchController.findMatchById
);

// router.get("/team/:teamId", MatchController.findMatchByTeamId);

router.post(
  "/",
  adminMiddleware,
  validateSchema(createMatchSchema),
  MatchController.createMatch
);

router.put(
  "/:matchId",
  adminMiddleware,
  validateSchema(idSchema, "params"),
  validateSchema(updateMatchSchema),
  MatchController.updateMatch
);

router.delete(
  "/:matchId",
  adminMiddleware,
  validateSchema(idSchema, "params"),
  MatchController.deleteMatch
);

export default router;
