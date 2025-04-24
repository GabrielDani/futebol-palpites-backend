import { Router } from "express";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import MatchController from "../controllers/MatchController.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import {
  createMatchSchema,
  idSchema,
  quantity,
  round,
  updateMatchSchema,
} from "../validations/matchValidation.js";

const router = Router();

router.use(authMiddleware);

router.get("/", MatchController.getAllMatches);
router.get(
  "/nextmatches/:quantity",
  validateSchema(quantity, "params"),
  MatchController.findNextMatches
);
router.get(
  "/round/:round",
  validateSchema(round, "params"),
  MatchController.findMatchByRound
);
router.get("/standings", MatchController.getStandings);
router.get(
  "/id/:matchId",
  validateSchema(idSchema, "params"),
  MatchController.findMatchById
);
router.post(
  "/",
  adminMiddleware,
  validateSchema(createMatchSchema),
  MatchController.createMatch
);
router.put(
  "/:matchId",
  adminMiddleware,
  validateSchema(idSchema, "params"),
  validateSchema(updateMatchSchema),
  MatchController.updateMatch
);
router.delete(
  "/:matchId",
  adminMiddleware,
  validateSchema(idSchema, "params"),
  MatchController.deleteMatch
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Partidas
 *   description: Endpoints para gerenciamento de partidas do campeonato
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Match:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         homeTeam:
 *           $ref: '#/components/schemas/Team'
 *         awayTeam:
 *           $ref: '#/components/schemas/Team'
 *         date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [PENDING, ONGOING, FINISHED]
 *         round:
 *           type: integer
 *         scoreHome:
 *           type: integer
 *           nullable: true
 *         scoreAway:
 *           type: integer
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
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
 *           nullable: true
 *         logoUrl:
 *           type: string
 *           nullable: true
 *
 *     Standing:
 *       type: object
 *       properties:
 *         position:
 *           type: integer
 *         team:
 *           $ref: '#/components/schemas/Team'
 *         points:
 *           type: integer
 *         matches:
 *           type: integer
 *         wins:
 *           type: integer
 *         draws:
 *           type: integer
 *         losses:
 *           type: integer
 *         goalsFor:
 *           type: integer
 *         goalsAgainst:
 *           type: integer
 *         goalDifference:
 *           type: integer
 *
 *     CreateMatch:
 *       type: object
 *       required:
 *         - homeTeamId
 *         - awayTeamId
 *         - round
 *       properties:
 *         homeTeamId:
 *           type: integer
 *         awayTeamId:
 *           type: integer
 *         date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         round:
 *           type: integer
 *
 *     UpdateMatch:
 *       type: object
 *       properties:
 *         homeTeamId:
 *           type: integer
 *         awayTeamId:
 *           type: integer
 *         date:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [PENDING, ONGOING, FINISHED]
 *         round:
 *           type: integer
 *         scoreHome:
 *           type: integer
 *           nullable: true
 *         scoreAway:
 *           type: integer
 *           nullable: true
 */

/**
 * @swagger
 * /matches:
 *   get:
 *     summary: Lista todas as partidas
 *     description: Retorna todas as partidas do campeonato ordenadas por data
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de partidas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /matches/nextmatches/{quantity}:
 *   get:
 *     summary: Lista próximas partidas
 *     description: Retorna as próximas partidas agendadas (limitado pela quantidade)
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quantity
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Quantidade de partidas a serem retornadas
 *     responses:
 *       200:
 *         description: Próximas partidas retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       400:
 *         description: Quantidade inválida
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /matches/round/{round}:
 *   get:
 *     summary: Lista partidas por rodada
 *     description: Retorna todas as partidas de uma rodada específica
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: round
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: Número da rodada
 *     responses:
 *       200:
 *         description: Partidas da rodada retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Match'
 *       400:
 *         description: Rodada inválida
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /matches/standings:
 *   get:
 *     summary: Obtém a tabela de classificação
 *     description: Retorna a tabela de classificação do campeonato
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tabela de classificação retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Standing'
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /matches/id/{matchId}:
 *   get:
 *     summary: Obtém detalhes de uma partida
 *     description: Retorna os detalhes completos de uma partida específica
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID da partida
 *     responses:
 *       200:
 *         description: Detalhes da partida retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Partida não encontrada
 */

/**
 * @swagger
 * /matches:
 *   post:
 *     summary: Cria uma nova partida (Admin)
 *     description: Cria uma nova partida no campeonato (requer privilégios de administrador)
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMatch'
 *     responses:
 *       201:
 *         description: Partida criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       400:
 *         description: Dados inválidos ou times iguais
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer admin)
 *       409:
 *         description: Conflito (time já tem partida na rodada)
 */

/**
 * @swagger
 * /matches/{matchId}:
 *   put:
 *     summary: Atualiza uma partida (Admin)
 *     description: Atualiza os dados de uma partida existente (requer privilégios de administrador)
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID da partida
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMatch'
 *     responses:
 *       200:
 *         description: Partida atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Match'
 *       400:
 *         description: Dados inválidos ou times iguais
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer admin)
 *       404:
 *         description: Partida não encontrada
 *       409:
 *         description: Conflito (time já tem partida na rodada)
 */

/**
 * @swagger
 * /matches/{matchId}:
 *   delete:
 *     summary: Remove uma partida (Admin)
 *     description: Remove uma partida do campeonato (requer privilégios de administrador)
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: matchId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID da partida
 *     responses:
 *       204:
 *         description: Partida removida com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer admin)
 *       404:
 *         description: Partida não encontrada
 */
