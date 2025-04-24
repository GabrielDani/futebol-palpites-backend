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
router.get("/my", GuessController.findMyGuesses);
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
 *     summary: Lista todos os palpites
 *     description: Retorna todos os palpites do sistema (apenas para administradores)
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
 *                 type: object
 *                 properties:
 *                   matchId:
 *                     type: string
 *                     format: uuid
 *                   userId:
 *                     type: string
 *                     format: uuid
 *                   userNickname:
 *                     type: string
 *                   homeTeam:
 *                     type: string
 *                   scoreHome:
 *                     type: integer
 *                   awayTeam:
 *                     type: string
 *                   scoreAway:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer permissão de admin)
 */

/**
 * @swagger
 * /guesses/my:
 *   get:
 *     summary: Lista os palpites do usuário atual
 *     description: Retorna todos os palpites do usuário autenticado com detalhes das partidas
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
 *                 type: object
 *                 properties:
 *                   match:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       homeTeam:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           shortName:
 *                             type: string
 *                           logoUrl:
 *                             type: string
 *                       awayTeam:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           shortName:
 *                             type: string
 *                           logoUrl:
 *                             type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                         enum: [PENDING, ONGOING, FINISHED]
 *                       round:
 *                         type: integer
 *                       scoreHome:
 *                         type: integer
 *                       scoreAway:
 *                         type: integer
 *                   guess:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       scoreHome:
 *                         type: integer
 *                       scoreAway:
 *                         type: integer
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /guesses:
 *   post:
 *     summary: Cria ou atualiza palpites
 *     description: Cria novos palpites ou atualiza existentes para o usuário autenticado
 *     tags: [Palpites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               required:
 *                 - matchId
 *                 - scoreHome
 *                 - scoreAway
 *               properties:
 *                 matchId:
 *                   type: string
 *                   format: uuid
 *                   example: "d9d90a1a-fc91-451c-adae-8fa25d3b1d02"
 *                 scoreHome:
 *                   type: integer
 *                   minimum: 0
 *                   example: 2
 *                 scoreAway:
 *                   type: integer
 *                   minimum: 0
 *                   example: 1
 *     responses:
 *       200:
 *         description: Palpites processados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 createdCount:
 *                   type: integer
 *                   description: Número de palpites criados
 *                 updatedCount:
 *                   type: integer
 *                   description: Número de palpites atualizados
 *       400:
 *         description: Dados inválidos ou faltando
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Partida já iniciada ou finalizada
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
 *       200:
 *         description: Palpite removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 matchId:
 *                   type: string
 *                   format: uuid
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Partida já iniciada ou finalizada
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
 *         userId:
 *           type: string
 *           format: uuid
 *         userNickname:
 *           type: string
 *         homeTeam:
 *           type: string
 *         scoreHome:
 *           type: integer
 *         awayTeam:
 *           type: string
 *         scoreAway:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     MatchWithGuess:
 *       type: object
 *       properties:
 *         match:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             homeTeam:
 *               $ref: '#/components/schemas/Team'
 *             awayTeam:
 *               $ref: '#/components/schemas/Team'
 *             date:
 *               type: string
 *               format: date-time
 *             status:
 *               type: string
 *               enum: [PENDING, ONGOING, FINISHED]
 *             round:
 *               type: integer
 *             scoreHome:
 *               type: integer
 *             scoreAway:
 *               type: integer
 *         guess:
 *           type: object
 *           nullable: true
 *           properties:
 *             scoreHome:
 *               type: integer
 *             scoreAway:
 *               type: integer
 *
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         shortName:
 *           type: string
 *         logoUrl:
 *           type: string
 */
