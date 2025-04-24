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
 * components:
 *   schemas:
 *     Team:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Flamengo"
 *         shortName:
 *           type: string
 *           nullable: true
 *           example: "FLA"
 *         logoUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: "https://example.com/logo.png"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00Z"
 *         homeMatches:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MatchWithTeams'
 *         awayMatches:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MatchWithTeams'
 *
 *     MatchWithTeams:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
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
 *         homeTeam:
 *           $ref: '#/components/schemas/TeamBasic'
 *         awayTeam:
 *           $ref: '#/components/schemas/TeamBasic'
 *
 *     TeamBasic:
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
 *           format: uri
 *           nullable: true
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
 *           nullable: true
 *           example: "FLA"
 *         logoUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: "https://example.com/logo.png"
 *
 *     UpdateTeam:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Flamengo"
 *         shortName:
 *           type: string
 *           nullable: true
 *           example: "FLA"
 *         logoUrl:
 *           type: string
 *           format: uri
 *           nullable: true
 *           example: "https://example.com/logo.png"
 */

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Lista todos os times ou busca por nome
 *     description: Retorna todos os times cadastrados ou filtra por nome quando fornecido
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
 *                 $ref: '#/components/schemas/TeamBasic'
 *       400:
 *         description: Parâmetro de busca inválido
 */

/**
 * @swagger
 * /teams/{id}:
 *   get:
 *     summary: Obtém detalhes de um time
 *     description: Retorna os detalhes completos de um time incluindo suas partidas
 *     tags: [Times]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: true
 *         description: ID do time
 *         example: 1
 *     responses:
 *       200:
 *         description: Detalhes do time retornados com sucesso
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
 *     summary: Cria um novo time (Admin)
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
 *     summary: Atualiza um time (Admin)
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
 *         description: ID do time
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
 *     summary: Remove um time (Admin)
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
 *         description: ID do time
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
