import { Router } from "express";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import TeamController from "../controllers/TeamController.js";

const router = new Router();

router.post("/", authMiddleware, adminMiddleware, TeamController.createTeam);
router.get("/", (req, res) => {
  if (req.query.name) {
    return TeamController.findTeamByName(req, res);
  }
  return TeamController.getAllTeams(req, res);
});
router.put("/:id", authMiddleware, adminMiddleware, TeamController.updateTeam);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  TeamController.deleteTeam
);

export default router;
