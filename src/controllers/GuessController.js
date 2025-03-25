import GuessService from "../services/GuessService.js";

class GuessController {
  findGuesses = async (req, res, next) => {
    try {
      const guesses = await GuessService.findGuesses();
      res.status(200).json(guesses);
    } catch (error) {
      next(error);
    }
  };

  createOrUpdateGuess = async (req, res, next) => {
    try {
      const guess = await GuessService.createOrUpdateGuess(
        req.user.id,
        req.body
      );
      res.status(201).json(guess);
    } catch (error) {
      next(error);
    }
  };

  deleteGuess = async (req, res, next) => {
    try {
      await GuessService.deleteGuess(req.user.id, req.params.matchId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default new GuessController();
