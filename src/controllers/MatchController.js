import MatchService from "../services/MatchService.js";

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
      const match = await MatchService.findMatchById(req.params.matchId);
      res.status(200).json(match);
    } catch (error) {
      next(error);
    }
  };

  // findMatchByTeamId = async (req, res, next) => {
  //   try {
  //     const teamId = checkSchema(Number(req.params.teamId), idTeamSchema);
  //     const matches = await MatchService.findMatchByTeamId(teamId);
  //     res.status(200).json(matches);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

  createMatch = async (req, res, next) => {
    try {
      const match = await MatchService.createMatch(req.body);
      res.status(201).json(match);
    } catch (error) {
      next(error);
    }
  };

  updateMatch = async (req, res, next) => {
    try {
      const match = await MatchService.updateMatch(
        req.params.matchId,
        req.body
      );
      res.status(200).json(match);
    } catch (error) {
      next(error);
    }
  };

  deleteMatch = async (req, res, next) => {
    try {
      await MatchService.deleteMatch(req.params.matchId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default new MatchController();
