import { Router } from "express";
import { adminMiddleware } from "../middlewares/authMiddleware.js";
import TeamController from "../controllers/TeamController.js";

const router = new Router();

router.get("/", (req, res, next) => {
  if (req.query.name) {
    return TeamController.findTeamByName(req, res, next);
  }
  return TeamController.getAllTeams(req, res, next);
});

router.get("/:id", TeamController.findById);

router.post("/", adminMiddleware, TeamController.createTeam);

router.put("/:id", adminMiddleware, TeamController.updateTeam);

router.delete("/:id", adminMiddleware, TeamController.deleteTeam);

export default router;
