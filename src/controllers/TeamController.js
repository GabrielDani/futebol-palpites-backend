import TeamService from "../services/TeamService.js";
import { checkSchema } from "../utils/validationUtils.js";
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
    try {
      const id = checkSchema(Number(req.params.id), idTeamSchema);
      const team = await TeamService.findById(id);
      return res.status(200).json(team);
    } catch (error) {
      next(error);
    }
  }

  async findTeamByName(req, res, next) {
    try {
      const name = checkSchema(req.query.name, nameTeamSchema);
      const team = await TeamService.findTeamByName(name);
      return res.status(200).json(team);
    } catch (error) {
      next(error);
    }
  }

  async createTeam(req, res, next) {
    try {
      const data = checkSchema(req.body, createTeamSchema);
      const team = await TeamService.createTeam(data);
      return res.status(201).json(team);
    } catch (error) {
      next(error);
    }
  }

  async updateTeam(req, res, next) {
    try {
      const id = checkSchema(Number(req.params.id), idTeamSchema);
      const data = checkSchema(req.body, updateTeamSchema);
      const team = await TeamService.updateTeam(id, data);
      return res.status(200).json(team);
    } catch (error) {
      next(error);
    }
  }

  async deleteTeam(req, res, next) {
    try {
      const id = checkSchema(Number(req.params.id), idTeamSchema);
      await TeamService.deleteTeam(id);
      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
}

export default new TeamController();
