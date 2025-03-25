import MatchService from "../services/MatchService.js";
import { checkSchema } from "../utils/validationUtils.js";
import {
  createMatchSchema,
  updateMatchSchema,
  uuidMatchSchema,
} from "../validations/matchValidation.js";
import { idTeamSchema } from "../validations/teamValidation.js";

class MatchController {
  getAllMatches = async (req, res, next) => {
    try {
      const matches = await MatchService.getAllMatches();
      res.status(200).json(matches);
    } catch (error) {
      next(error);
    }
  };

  findMatchById = async (req, res, next) => {
    try {
      const id = checkSchema(req.params.id, uuidMatchSchema);
      const match = await MatchService.findMatchById(id);
      res.status(200).json(match);
    } catch (error) {
      next(error);
    }
  };

  findMatchByTeamId = async (req, res, next) => {
    try {
      const teamId = checkSchema(Number(req.params.teamId), idTeamSchema);
      const matches = await MatchService.findMatchByTeamId(teamId);
      res.status(200).json(matches);
    } catch (error) {
      next(error);
    }
  };

  createMatch = async (req, res, next) => {
    try {
      const data = checkSchema(req.body, createMatchSchema);
      const match = await MatchService.createMatch(data);
      res.status(201).json(match);
    } catch (error) {
      next(error);
    }
  };

  updateMatch = async (req, res, next) => {
    try {
      const id = checkSchema(req.params.id, uuidMatchSchema);
      const newData = checkSchema(req.body, updateMatchSchema);
      const match = await MatchService.updateMatch(id, newData);
      res.status(200).json(match);
    } catch (error) {
      next(error);
    }
  };

  deleteMatch = async (req, res, next) => {
    try {
      const id = checkSchema(req.params.id, uuidMatchSchema);
      await MatchService.deleteMatch(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default new MatchController();
