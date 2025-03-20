import TeamService from "../services/TeamService.js";
import {
  createTeamSchema,
  updateTeamSchema,
  uuidSchema,
} from "../validations/teamValidation.js";

class TeamController {
  async createTeam(req, res) {
    const { name, shortName, logoUrl } = req.body;
    const validation = createTeamSchema.safeParse(req.body);

    if (!validation.success)
      return res.status(400).json({ error: validation.error.format() });

    try {
      const team = await TeamService.createTeam(name, shortName, logoUrl);
      res.status(201).json(team);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async findTeamByName(req, res) {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ error: "Nome do time é obrigatório." });
    }

    try {
      const team = await TeamService.findTeamByName(name);

      if (team) {
        res.status(200).json(team);
      } else {
        res.status(404).json({ error: "Time não encontrado." });
      }
    } catch (error) {
      res.status(500).json({ error: "Erro interno do servidor." });
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

  async updateTeam(req, res) {
    const { id } = req.params;
    const validationId = uuidSchema.safeParse(id);
    if (!validationId.success)
      return res.status(400).json({ error: validationId.error.format() });

    const dataValidation = updateTeamSchema.safeParse(req.body);
    if (!dataValidation.success)
      return res.status(400).json({ error: dataValidation.error.format() });

    const data = dataValidation.data;

    try {
      const team = await TeamService.updateTeam(id, data);
      res.status(200).json(team);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTeam(req, res) {
    const { id } = req.params;
    const validateId = uuidSchema.safeParse(id);
    if (!validateId.success)
      return res.status(400).json({ error: validateId.error.format() });

    try {
      await TeamService.deleteTeam(id);
      return res.status(204).json();
    } catch (error) {
      if (error.message === "Time não encontrado.") {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: "Erro interno do servidor." });
    }
  }
}

export default new TeamController();
