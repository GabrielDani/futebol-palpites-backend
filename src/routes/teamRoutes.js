import { Router } from "express";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import TeamController from "../controllers/TeamController.js";

const router = new Router();

router.post("/", authMiddleware, adminMiddleware, TeamController.createTeam);
router.get("/", TeamController.getAllTeams);

export default router;
