import RankingService from "../services/RankingService.js";

class RankingController {
  getRanking = async (req, res, next) => {
    try {
      const ranking = await RankingService.getRanking();
      res.status(200).json(ranking);
    } catch (error) {
      next(error);
    }
  };

  getPerformance = async (req, res, next) => {
    try {
      const performance = await RankingService.getPerformance(req.user.id);
      res.status(200).json(performance);
    } catch (error) {
      next(error);
    }
  };
}

export default new RankingController();
