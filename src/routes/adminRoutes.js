import { Router } from "express";
import {
  authMiddleware,
  adminMiddleware,
} from "../middlewares/authMiddleware.js";
import AdminController from "../controllers/AdminController.js";

const router = Router();

router.use(authMiddleware, adminMiddleware);

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Endpoints administrativos
 */

/**
 * @swagger
 * /dashboard/metrics:
 *   get:
 *     summary: Obtém métricas para o dashboard administrativo
 *     description: Retorna estatísticas como partidas do dia, contagem de usuários e times
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas do dashboard retornadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 todayMatches:
 *                   type: integer
 *                   description: Número de partidas agendadas para hoje
 *                   example: 5
 *                 usersCount:
 *                   type: object
 *                   properties:
 *                     actual:
 *                       type: integer
 *                       description: Número total de usuários cadastrados
 *                       example: 150
 *                     changeFromLastWeek:
 *                       type: integer
 *                       description: Diferença no número de usuários em relação à semana passada
 *                       example: 10
 *                 teamsCount:
 *                   type: integer
 *                   description: Número total de times cadastrados
 *                   example: 30
 *       401:
 *         description: Não autorizado - token inválido ou não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Token de autenticação inválido ou não fornecido"
 *       403:
 *         description: Acesso proibido - usuário não tem permissão de administrador
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Acesso restrito a administradores"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Erro ao buscar métricas do dashboard"
 */
router.get("/dashboard/metrics", AdminController.getDashboardMetrics);

export default router;
