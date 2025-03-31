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
  updateMatchSchema,
} from "../validations/matchValidation.js";

const router = Router();

router.use(authMiddleware);

router.get("/", MatchController.getAllMatches);

router.get(
  "/:matchId",
  validateSchema(idSchema, "params"),
  MatchController.findMatchById
);

// router.get("/team/:teamId", MatchController.findMatchByTeamId);

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
 * components:
 *   schemas:
 *     Match:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "d9d90a1a-fc91-451c-adae-8fa25d3b1d02"
 *         homeTeamId:
 *           type: integer
 *           minimum: 0
 *           example: 1
 *         awayTeamId:
 *           type: integer
 *           minimum: 0
 *           example: 2
 *         matchDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2023-05-15T19:00:00Z"
 *         status:
 *           type: string
 *           enum: [PENDING, ONGOING, FINISHED]
 *           default: "PENDING"
 *           example: "PENDING"
 *         round:
 *           type: integer
 *           minimum: 1
 *           maximum: 38
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-05-01T10:00:00Z"
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
 *           minimum: 0
 *           example: 1
 *         awayTeamId:
 *           type: integer
 *           minimum: 0
 *           example: 2
 *         matchDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2023-05-15T19:00:00Z"
 *         status:
 *           type: string
 *           enum: [PENDING, ONGOING, FINISHED]
 *           default: "PENDING"
 *           example: "PENDING"
 *         round:
 *           type: integer
 *           minimum: 1
 *           maximum: 38
 *           example: 1
 *
 *     UpdateMatch:
 *       type: object
 *       properties:
 *         homeTeamId:
 *           type: integer
 *           minimum: 0
 *           example: 1
 *         awayTeamId:
 *           type: integer
 *           minimum: 0
 *           example: 2
 *         matchDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: "2023-05-15T19:00:00Z"
 *         status:
 *           type: string
 *           enum: [PENDING, ONGOING, FINISHED]
 *           example: "ONGOING"
 *         round:
 *           type: integer
 *           minimum: 1
 *           maximum: 38
 *           example: 1
 */

/**
 * @swagger
 * /matches:
 *   get:
 *     summary: Lista todas as partidas
 *     description: Retorna todas as partidas do campeonato
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
 * /matches/{matchId}:
 *   get:
 *     summary: Obtém uma partida específica
 *     description: Retorna os detalhes de uma partida pelo seu ID
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
 *         example: "d9d90a1a-fc91-451c-adae-8fa25d3b1d02"
 *     responses:
 *       200:
 *         description: Partida retornada com sucesso
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
 *     summary: Cria uma nova partida (Apenas admin)
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
 *         description: Dados inválidos ou faltando
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer admin)
 */

/**
 * @swagger
 * /matches/{matchId}:
 *   put:
 *     summary: Atualiza uma partida (Apenas admin)
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
 *         example: "d9d90a1a-fc91-451c-adae-8fa25d3b1d02"
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
 *         description: ID inválido ou dados incorretos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer admin)
 *       404:
 *         description: Partida não encontrada
 */

/**
 * @swagger
 * /matches/{matchId}:
 *   delete:
 *     summary: Remove uma partida (Apenas admin)
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
 *         example: "d9d90a1a-fc91-451c-adae-8fa25d3b1d02"
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
