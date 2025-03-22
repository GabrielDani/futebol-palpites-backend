import { Router } from "express";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import MatchController from "../controllers/MatchController.js";

const router = Router();

router.use(authMiddleware);

router.get("/", MatchController.getAllMatches);
router.get("/:id", MatchController.findMatchById);
router.get("/team/:teamId", MatchController.findMatchByTeamId);
router.post("/", adminMiddleware, MatchController.createMatch);
router.put("/:id", adminMiddleware, MatchController.updateMatch);
router.delete("/:id", adminMiddleware, MatchController.deleteMatch);

export default router;
