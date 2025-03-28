import TeamService from "../services/TeamService.js";

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
      const team = await TeamService.findById(Number(req.params.id));
      return res.status(200).json(team);
    } catch (error) {
      next(error);
    }
  }

  async findTeamByName(req, res, next) {
    try {
      const team = await TeamService.findTeamByName(req.query.name);
      return res.status(200).json(team);
    } catch (error) {
      next(error);
    }
  }

  async createTeam(req, res, next) {
    try {
      const team = await TeamService.createTeam(req.body);
      return res.status(201).json(team);
    } catch (error) {
      next(error);
    }
  }

  async updateTeam(req, res, next) {
    try {
      const team = await TeamService.updateTeam(
        Number(req.params.id),
        req.body
      );
      return res.status(200).json(team);
    } catch (error) {
      next(error);
    }
  }

  async deleteTeam(req, res, next) {
    try {
      await TeamService.deleteTeam(Number(req.params.id));
      return res.status(204).json();
    } catch (error) {
      next(error);
    }
  }
}

export default new TeamController();
