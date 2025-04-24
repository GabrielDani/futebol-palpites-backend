import { Router } from "express";
import UserController from "../controllers/UserController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import {
  idSchema,
  createSchema,
  updateSchema,
  nicknameSchema,
} from "../validations/userValidation.js";

const router = Router();

router.get("/me", authMiddleware, UserController.me);
router.get("/profile", authMiddleware, UserController.profile);
router.get("/", authMiddleware, UserController.getAllUsers);
router.get(
  "/find/:id",
  validateSchema(idSchema, "params"),
  UserController.findUserById
);
router.get(
  "/find/nickname/:nickname",
  validateSchema(nicknameSchema, "params"),
  UserController.findUserByNickname
);
router.get("/groups", authMiddleware, UserController.findUserGroups);
router.get("/guesses", authMiddleware, UserController.findUserGuesses);
router.post("/", validateSchema(createSchema), UserController.createUser);
router.put(
  "/:id",
  authMiddleware,
  validateSchema(updateSchema),
  UserController.updateUser
);
router.delete(
  "/:id",
  authMiddleware,
  validateSchema(idSchema, "params"),
  UserController.deleteUser
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gerenciamento de usuários do sistema
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "c5d2e9b0-4e2a-11ee-be56-0242ac120002"
 *         nickname:
 *           type: string
 *           example: "User1"
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *           example: "USER"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-03-30T14:23:45.678Z"
 *
 *     UserProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         nickname:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [USER, ADMIN]
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 *     UserGroup:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         isPublic:
 *           type: boolean
 *         creator:
 *           type: object
 *           properties:
 *             nickname:
 *               type: string
 *         memberCount:
 *           type: integer
 *
 *     UserGuess:
 *       type: object
 *       properties:
 *         matchId:
 *           type: string
 *           format: uuid
 *         homeTeam:
 *           type: string
 *         awayTeam:
 *           type: string
 *         scoreHome:
 *           type: integer
 *         scoreAway:
 *           type: integer
 *         matchDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [PENDING, ONGOING, FINISHED]
 *
 *     UserInput:
 *       type: object
 *       required:
 *         - nickname
 *         - password
 *       properties:
 *         nickname:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           example: "NewUser"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: "securePassword123"
 *         email:
 *           type: string
 *           format: email
 *           example: "user@example.com"
 *
 *     UserUpdate:
 *       type: object
 *       properties:
 *         nickname:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *           example: "UpdatedUser"
 *         password:
 *           type: string
 *           format: password
 *           minLength: 6
 *           example: "newSecurePassword123"
 *         email:
 *           type: string
 *           format: email
 *           example: "updated@example.com"
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     summary: Obter informações básicas do usuário autenticado
 *     description: Retorna um DTO com informações básicas do usuário (sem dados sensíveis)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informações básicas do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: Obter perfil completo do usuário autenticado
 *     description: Retorna todos os dados do perfil do usuário (incluindo email)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil completo do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Listar todos os usuários (Autenticado)
 *     description: Retorna uma lista de DTOs de todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /user/find/{id}:
 *   get:
 *     summary: Buscar usuário por ID
 *     description: Retorna um DTO com informações básicas do usuário pelo ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         example: "c5d2e9b0-4e2a-11ee-be56-0242ac120002"
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /user/find/nickname/{nickname}:
 *   get:
 *     summary: Buscar usuário por apelido
 *     description: Retorna um DTO com informações básicas do usuário pelo nickname
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: nickname
 *         schema:
 *           type: string
 *           minLength: 3
 *           maxLength: 20
 *         required: true
 *         example: "User1"
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Apelido inválido
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /user/groups:
 *   get:
 *     summary: Obter grupos do usuário autenticado
 *     description: Retorna os grupos aos quais o usuário pertence
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Grupos do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 groups:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserGroup'
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /user/guesses:
 *   get:
 *     summary: Obter palpites do usuário autenticado
 *     description: Retorna os palpites feitos pelo usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Palpites do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 guesses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserGuess'
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Criar novo usuário
 *     description: Registra um novo usuário no sistema
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 */

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Atualizar usuário (Autenticado)
 *     description: Atualiza os dados do usuário (apenas próprio usuário ou admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         example: "c5d2e9b0-4e2a-11ee-be56-0242ac120002"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Usuário não encontrado
 */

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Remover usuário (Autenticado)
 *     description: Remove um usuário do sistema (apenas próprio usuário ou admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         example: "c5d2e9b0-4e2a-11ee-be56-0242ac120002"
 *     responses:
 *       204:
 *         description: Usuário removido com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Permissão negada
 *       404:
 *         description: Usuário não encontrado
 */
