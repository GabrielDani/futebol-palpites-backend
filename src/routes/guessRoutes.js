import GuessController from "../controllers/GuessController.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createOrUpdateGuessSchema,
  idSchema,
} from "../validations/guessValidation.js";

const router = new Router();

router.use(authMiddleware);

router.get("/", GuessController.findGuesses);

router.post(
  "/",
  validateSchema(createOrUpdateGuessSchema),
  GuessController.createOrUpdateGuess
);
router.delete(
  "/:matchId",
  validateSchema(idSchema, "params"),
  GuessController.deleteGuess
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Palpites
 *   description: Endpoints para gerenciamento de palpites nos jogos
 */

/**
 * @swagger
 * /guesses:
 *   get:
 *     summary: Lista todos os palpites de todos usuários
 *     description: Retorna todos os palpites feitos pelo usuário autenticado
 *     tags: [Palpites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de palpites retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Guess'
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /guesses:
 *   post:
 *     summary: Cria ou atualiza um palpite
 *     description: Cria um novo palpite ou atualiza um existente para o usuário autenticado
 *     tags: [Palpites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrUpdateGuess'
 *     responses:
 *       200:
 *         description: Palpite criado/atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Guess'
 *       400:
 *         description: Dados inválidos ou faltando
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /guesses/{matchId}:
 *   delete:
 *     summary: Remove um palpite
 *     description: Remove um palpite específico do usuário autenticado
 *     tags: [Palpites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         example: "d9d90a1a-fc91-451c-adae-8fa25d3b1d02"
 *     responses:
 *       204:
 *         description: Palpite removido com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Palpite não encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Guess:
 *       type: object
 *       properties:
 *         matchId:
 *           type: string
 *           format: uuid
 *           example: "d9d90a1a-fc91-451c-adae-8fa25d3b1d02"
 *         homeTeam:
 *           type: string
 *           example: "FLU"
 *         scoreHome:
 *           type: integer
 *           example: 2
 *         awayTeam:
 *           type: string
 *           example: "ATL"
 *         scoreAway:
 *           type: integer
 *           example: 2
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-05-01T10:00:00Z"
 *
 *     CreateOrUpdateGuess:
 *       type: object
 *       required:
 *         - matchId
 *         - scoreHome
 *         - scoreAway
 *       properties:
 *         matchId:
 *           type: string
 *           format: uuid
 *           example: "d9d90a1a-fc91-451c-adae-8fa25d3b1d02"
 *         scoreHome:
 *           type: integer
 *           minimum: 0
 *           example: 2
 *         scoreAway:
 *           type: integer
 *           minimum: 0
 *           example: 2
 */
