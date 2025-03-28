import { Router } from "express";
import { adminMiddleware } from "../middlewares/authMiddleware.js";
import TeamController from "../controllers/TeamController.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import {
  idSchema,
  nameSchema,
  createTeamSchema,
  updateTeamSchema,
} from "../validations/teamValidation.js";

const router = new Router();

router.get("/", (req, res, next) => {
  if (req.query.name) {
    validateSchema(nameSchema, "query");
    return TeamController.findTeamByName(req, res, next);
  }
  return TeamController.getAllTeams(req, res, next);
});

router.get("/:id", validateSchema(idSchema, "params"), TeamController.findById);

router.post(
  "/",
  adminMiddleware,
  validateSchema(createTeamSchema),
  TeamController.createTeam
);

router.put(
  "/:id",
  adminMiddleware,
  validateSchema(idSchema, "params"),
  validateSchema(updateTeamSchema),
  TeamController.updateTeam
);

router.delete(
  "/:id",
  adminMiddleware,
  validateSchema(idSchema, "params"),
  TeamController.deleteTeam
);

export default router;
