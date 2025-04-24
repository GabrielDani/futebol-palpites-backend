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

  findNextMatches = async (req, res, next) => {
    try {
      const matches = await MatchService.findNextMatches(
        Number(req.params.quantity)
      );
      res.status(200).json(matches);
    } catch (error) {
      next(error);
    }
  };

  findMatchByRound = async (req, res, next) => {
    try {
      console.log(
        `[MatchController] (findMatchByRound) Procurando partidas do round ${req.params.round}...`
      );
      const matches = await MatchService.findMatchByRound(
        Number(req.params.round)
      );
      console.log(
        `[MatchController] (findMatchByRound) Quantidade de partidas encontradas do round ${req.params.round}: ${matches.length}`
      );
      res.status(200).json(matches);
    } catch (error) {
      next(error);
    }
  };

  getStandings = async (req, res, next) => {
    try {
      console.log(`[MatchController](getStandings) Ordenando classificação...`);
      const standings = await MatchService.getStandings();
      // console.log(`[MatchController](getStandings) Classificação:`, standings);
      res.status(200).json(standings);
    } catch (error) {
      next(error);
    }
  };

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
