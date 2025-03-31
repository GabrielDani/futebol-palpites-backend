import { Router } from "express";
import { adminMiddleware } from "../middlewares/authMiddleware.js";
import TeamController from "../controllers/TeamController.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import {
  idSchema,
  nameSchema,
  createTeamSchema,
  updateTeamSchema,
} from "../validations/teamValidation.js";

const router = new Router();

router.get("/", (req, res, next) => {
  if (req.query.name) {
    validateSchema(nameSchema, "query");
    return TeamController.findTeamByName(req, res, next);
  }
  return TeamController.getAllTeams(req, res, next);
});

router.get("/:id", validateSchema(idSchema, "params"), TeamController.findById);

router.post(
  "/",
  adminMiddleware,
  validateSchema(createTeamSchema),
  TeamController.createTeam
);

router.put(
  "/:id",
  adminMiddleware,
  validateSchema(idSchema, "params"),
  validateSchema(updateTeamSchema),
  TeamController.updateTeam
);

router.delete(
  "/:id",
  adminMiddleware,
  validateSchema(idSchema, "params"),
  TeamController.deleteTeam
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Times
 *   description: Endpoints para gerenciamento de times do campeonato
 */

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Lista todos os times ou busca por nome
 *     description: Retorna todos os times ou filtra por nome se o parâmetro name for fornecido
 *     tags: [Times]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Nome do time para busca
 *         example: "Flamengo"
 *     responses:
 *       200:
 *         description: Lista de times retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Team'
 *       400:
 *         description: Parâmetro de busca inválido
 */

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Obtém um time específico
 *     description: Retorna os detalhes de um time pelo seu ID
 *     tags: [Times]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         example: 1
 *     responses:
 *       200:
 *         description: Time retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Time não encontrado
 */

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Cria um novo time (Apenas admin)
 *     description: Cria um novo time no campeonato (requer privilégios de administrador)
 *     tags: [Times]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTeam'
 *     responses:
 *       201:
 *         description: Time criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: Dados inválidos ou faltando
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer admin)
 */

/**
 * @swagger
 * /teams/{id}:
 *   put:
 *     summary: Atualiza um time (Apenas admin)
 *     description: Atualiza os dados de um time existente (requer privilégios de administrador)
 *     tags: [Times]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTeam'
 *     responses:
 *       200:
 *         description: Time atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Team'
 *       400:
 *         description: ID inválido ou dados incorretos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer admin)
 *       404:
 *         description: Time não encontrado
 */

/**
 * @swagger
 * /teams/{id}:
 *   delete:
 *     summary: Remove um time (Apenas admin)
 *     description: Remove um time do campeonato (requer privilégios de administrador)
 *     tags: [Times]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         example: 1
 *     responses:
 *       204:
 *         description: Time removido com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado (requer admin)
 *       404:
 *         description: Time não encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *         name:
 *           type: string
 *           example: "Flamengo"
 *         shortName:
 *           type: string
 *           example: "FLA"
 *         logoUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: "https://example.com/logo/flamengo.png"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-05-01T10:00:00Z"
 *
 *     CreateTeam:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: "Flamengo"
 *         shortName:
 *           type: string
 *           example: "FLA"
 *         logoUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: "https://example.com/logo/flamengo.png"
 *
 *     UpdateTeam:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Flamengo"
 *         shortName:
 *           type: string
 *           example: "FLA"
 *         logoUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: "https://example.com/logo/flamengo.png"
 */
