import TeamService from "../services/TeamService.js";
import { BadRequestError, NotFoundError } from "../utils/customErrors.js";
import { formatZodError } from "../utils/validationUtils.js";
import {
  createTeamSchema,
  updateTeamSchema,
  idTeamSchema,
  nameTeamSchema,
} from "../validations/teamValidation.js";

class TeamController {
  async getAllTeams(req, res, next) {
    try {
      const teams = await TeamService.getAllTeams();
      return res.status(200).json(teams);
    } catch (error) {
      next(error);
    }
  }

  async findById(req, res, next) {
    const { id } = req.params;
    const idValidation = idTeamSchema.safeParse(Number(id));

    if (!idValidation.success) {
      return next(new BadRequestError(formatZodError(idValidation.error)));
    }

    try {
      const team = await TeamService.findById(Number(id));
      if (!team) return next(new NotFoundError("Time não encontrado."));

      return res.status(200).json(team);
    } catch (error) {
      next(error);
    }
  }

  async findTeamByName(req, res, next) {
    const { name } = req.query;

    const validation = nameTeamSchema.safeParse(name);
    if (!validation.success)
      return next(new BadRequestError(formatZodError(validation.error)));

    try {
      const team = await TeamService.findTeamByName(name);
      if (!team) next(new NotFoundError("Time não encontrado."));
      return res.status(200).json(team);
    } catch (error) {
      next(error);
    }
  }

  async createTeam(req, res, next) {
    const { name, shortName, logoUrl } = req.body;
    const validation = createTeamSchema.safeParse(req.body);

    if (!validation.success)
      return next(new BadRequestError(formatZodError(validation.error)));

    try {
      const team = await TeamService.createTeam(name, shortName, logoUrl);
      return res.status(201).json(team);
    } catch (error) {
      next(error);
    }
  }

  async updateTeam(req, res, next) {
    const { id } = req.params;

    const idValidation = idTeamSchema.safeParse(Number(id));
    if (!idValidation.success)
      return next(new BadRequestError(formatZodError(idValidation.error)));

    const dataValidation = updateTeamSchema.safeParse(req.body);
    if (!dataValidation.success)
      return next(new BadRequestError(formatZodError(dataValidation.error)));

    const data = dataValidation.data;

    try {
      const team = await TeamService.updateTeam(Number(id), data);
      return res.status(200).json(team);
    } catch (error) {
      next(error);
    }
  }

  async deleteTeam(req, res, next) {
    const { id } = req.params;

    const idValidation = idTeamSchema.safeParse(Number(id));
    if (!idValidation.success)
      return next(new BadRequestError(formatZodError(idValidation.error)));

    try {
      await TeamService.deleteTeam(Number(id));
      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
}

export default new TeamController();
