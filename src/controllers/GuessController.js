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

  findMyGuesses = async (req, res, next) => {
    try {
      console.log(
        "[GuessController][findMyGuesses] Buscando palpites do usuário",
        req.user.id
      );
      const guesses = await GuessService.findMyGuesses(req.user.id);
      console.log(
        `[GuessController][findMyGuesses] Palpites do usuário ${req.user.id}: ${guesses}`
      );
      res.status(200).json(guesses);
    } catch (error) {
      next(error);
    }
  };

  createOrUpdateGuess = async (req, res, next) => {
    try {
      const result = await GuessService.createOrUpdateGuess(
        req.user.id,
        req.body
      );
      return res.status(200).json({
        message: "Palpites processados com sucesso",
        created: result.createdCount,
        updated: result.updatedCount,
      });
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
