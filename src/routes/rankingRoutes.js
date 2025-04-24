import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import RankingController from "../controllers/RankingController.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Ranking
 *   description: Endpoints para visualização de rankings e desempenho
 */

/**
 * @swagger
 * /ranking:
 *   get:
 *     summary: Obter ranking geral
 *     description: Retorna o ranking completo de todos os usuários com suas pontuações
 *     tags: [Ranking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ranking retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RankingEntry'
 *       401:
 *         description: Não autorizado
 */
router.get("/", RankingController.getRanking);

/**
 * @swagger
 * /ranking/performance:
 *   get:
 *     summary: Obter desempenho do usuário
 *     description: Retorna o desempenho detalhado do usuário autenticado
 *     tags: [Ranking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Desempenho retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RankingEntry'
 *       401:
 *         description: Não autorizado
 */
router.get("/performance", RankingController.getPerformance);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     RankingEntry:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *             nickname:
 *               type: string
 *               example: "jogador123"
 *         points:
 *           type: integer
 *           description: Pontos totais acumulados
 *           example: 15
 *         position:
 *           type: integer
 *           description: Posição no ranking geral (0 para performance individual)
 *           example: 3
 *         exactHits:
 *           type: integer
 *           description: Número de palpites exatos (placar correto)
 *           example: 2
 *         correctPredictions:
 *           type: integer
 *           description: Número de palpites com resultado correto
 *           example: 5
 *         totalGuesses:
 *           type: integer
 *           description: Total de palpites realizados em partidas finalizadas
 *           example: 8
 *
 *     UserPerformance:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             nickname:
 *               type: string
 *         points:
 *           type: integer
 *         exactHits:
 *           type: integer
 *         correctPredictions:
 *           type: integer
 *         totalGuesses:
 *           type: integer
 *         position:
 *           type: integer
 */

/**
 * @swagger
 * /ranking:
 *   get:
 *     summary: Obter ranking geral
 *     description: Retorna o ranking completo ordenado por pontuação
 *     tags: [Ranking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ranking retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RankingEntry'
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /ranking/performance:
 *   get:
 *     summary: Obter desempenho individual
 *     description: Retorna as estatísticas de desempenho do usuário autenticado
 *     tags: [Ranking]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Desempenho retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RankingEntry'
 *         examples:
 *           performance:
 *             value:
 *               user:
 *                 id: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
 *                 nickname: "jogador123"
 *               points: 12
 *               exactHits: 3
 *               correctPredictions: 5
 *               totalGuesses: 8
 *               position: 0
 *       401:
 *         description: Não autorizado
 */
