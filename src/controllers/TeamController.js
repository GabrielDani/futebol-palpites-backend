import TeamService from "../services/TeamService.js";
import { createTeamSchema } from "../validations/teamValidation.js";

class TeamController {
  async createTeam(req, res) {
    const { name, shortName, logoUrl } = req.body;
    const validation = createTeamSchema.safeParse(name, shortName, logoUrl);

    if (!validation.success)
      return res.status(400).json({ error: validation.error.format() });

    try {
      const team = await TeamService.createTeam(name, shortName, logoUrl);
      res.status(201).json(team);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getAllTeams(req, res) {
    try {
      const teams = await TeamService.getAllTeams();
      res.status(200).json(teams);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new TeamController();
