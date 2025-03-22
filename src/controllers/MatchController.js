import MatchService from "../services/MatchService.js";
import { BadRequestError, NotFoundError } from "../utils/customErrors.js";
import { formatZodError } from "../utils/validationUtils.js";
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
    const { id } = req.params;

    try {
      this.#checkSchema(id, uuidMatchSchema);
      const match = await MatchService.findMatchById(id);
      res.status(200).json(match);
    } catch (error) {
      next(error);
    }
  };

  findMatchByTeamId = async (req, res, next) => {
    const { teamId } = req.params;

    try {
      this.#checkSchema(Number(teamId), idTeamSchema);
      const matches = await MatchService.findMatchByTeamId(Number(teamId));
      res.status(200).json(matches);
    } catch (error) {
      next(error);
    }
  };

  createMatch = async (req, res, next) => {
    try {
      const data = this.#checkSchema(req.body, createMatchSchema);
      const match = await MatchService.createMatch(data);
      res.status(201).json(match);
    } catch (error) {
      next(error);
    }
  };

  updateMatch = async (req, res, next) => {
    const { id } = req.params;

    try {
      this.#checkSchema(id, uuidMatchSchema);
      const newData = this.#checkSchema(req.body, updateMatchSchema);
      const match = await MatchService.updateMatch(id, newData);
      res.status(200).json(match);
    } catch (error) {
      next(error);
    }
  };

  deleteMatch = async (req, res, next) => {
    const { id } = req.params;

    try {
      this.#checkSchema(id, uuidMatchSchema);
      await MatchService.deleteMatch(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  #checkSchema = (data, schema) => {
    const validation = schema.safeParse(data);
    if (!validation.success)
      throw new BadRequestError(formatZodError(validation.error));
    return validation.data;
  };
}

export default new MatchController();
