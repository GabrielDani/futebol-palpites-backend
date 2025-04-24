import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import GroupController from "../controllers/GroupController.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import { createGroupSchema, idSchema } from "../validations/groupValidation.js";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Grupos
 *   description: Gerenciamento de grupos de apostas
 */

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Lista todos os grupos acessíveis
 *     description: Retorna todos os grupos públicos ou privados que o usuário faz parte
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   isPublic:
 *                     type: boolean
 *                   creator:
 *                     type: object
 *                     properties:
 *                       nickname:
 *                         type: string
 *                   _count:
 *                     type: object
 *                     properties:
 *                       members:
 *                         type: integer
 *       401:
 *         description: Não autorizado
 */
router.get("/", GroupController.getAllGroups);

/**
 * @swagger
 * /groups/mygroups:
 *   get:
 *     summary: Lista os grupos do usuário
 *     description: Retorna todos os grupos que o usuário logado faz parte
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos do usuário
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   isPublic:
 *                     type: boolean
 *                   memberCount:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   createdBy:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       nickname:
 *                         type: string
 *       401:
 *         description: Não autorizado
 */
router.get("/mygroups", GroupController.getMyGroups);

/**
 * @swagger
 * /groups/public:
 *   get:
 *     summary: Lista grupos públicos
 *     description: Retorna todos os grupos públicos
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos públicos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   isPublic:
 *                     type: boolean
 *                   memberCount:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   createdBy:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       nickname:
 *                         type: string
 *       401:
 *         description: Não autorizado
 */
router.get("/public", GroupController.getPublicGroups);

/**
 * @swagger
 * /groups/private:
 *   get:
 *     summary: Lista grupos privados
 *     description: Retorna todos os grupos privados
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos privados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *                   isPublic:
 *                     type: boolean
 *                   memberCount:
 *                     type: integer
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   createdBy:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       nickname:
 *                         type: string
 *       401:
 *         description: Não autorizado
 */
router.get("/private", GroupController.getPrivateGroups);

/**
 * @swagger
 * /groups/{groupId}/details:
 *   get:
 *     summary: Detalhes de um grupo
 *     description: Retorna informações detalhadas de um grupo específico
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do grupo
 *     responses:
 *       200:
 *         description: Detalhes do grupo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 isPublic:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 createdBy:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                     nickname:
 *                       type: string
 *                 memberCount:
 *                   type: integer
 *                 members:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       nickname:
 *                         type: string
 *                 ranking:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           nickname:
 *                             type: string
 *                       points:
 *                         type: integer
 *                       position:
 *                         type: integer
 *                       correctPredictions:
 *                         type: integer
 *                       exactHits:
 *                         type: integer
 *                       totalGuesses:
 *                         type: integer
 *                 recentPredictions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       matchId:
 *                         type: string
 *                       homeTeam:
 *                         type: string
 *                       awayTeam:
 *                         type: string
 *                       userPrediction:
 *                         type: array
 *                         items:
 *                           type: number
 *                       actualResult:
 *                         type: array
 *                         items:
 *                           type: number
 *                       pointsEarned:
 *                         type: integer
 *       404:
 *         description: Grupo não encontrado
 *       401:
 *         description: Não autorizado
 */
router.get(
  "/:groupId/details",
  validateSchema(idSchema, "params"),
  GroupController.getGroupDetails
);

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Cria um novo grupo
 *     description: Cria um novo grupo e adiciona o criador como membro
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - isPublic
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *               isPublic:
 *                 type: boolean
 *               password:
 *                 type: string
 *                 minLength: 4
 *                 description: Obrigatório se isPublic for false
 *     responses:
 *       201:
 *         description: Grupo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 isPublic:
 *                   type: boolean
 *                 createdBy:
 *                   type: string
 *                   format: uuid
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 */
router.post(
  "/",
  validateSchema(createGroupSchema),
  GroupController.createGroup
);

/**
 * @swagger
 * /groups/{groupId}/join:
 *   post:
 *     summary: Entrar em um grupo
 *     description: Adiciona o usuário logado como membro de um grupo
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do grupo
 *     responses:
 *       200:
 *         description: Entrou no grupo com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 groupId:
 *                   type: string
 *                   format: uuid
 *       404:
 *         description: Grupo não encontrado
 *       401:
 *         description: Não autorizado
 *       409:
 *         description: Usuário já é membro do grupo
 */
router.post(
  "/:groupId/join",
  validateSchema(idSchema, "params"),
  GroupController.joinGroup
);

/**
 * @swagger
 * /groups/{groupId}/leave:
 *   post:
 *     summary: Sair de um grupo
 *     description: Remove o usuário logado de um grupo
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do grupo
 *     responses:
 *       200:
 *         description: Saiu do grupo com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 groupId:
 *                   type: string
 *                   format: uuid
 *       404:
 *         description: Grupo não encontrado ou usuário não é membro
 *       401:
 *         description: Não autorizado
 */
router.post(
  "/:groupId/leave",
  validateSchema(idSchema, "params"),
  GroupController.leaveGroup
);

/**
 * @swagger
 * /groups/{groupId}:
 *   delete:
 *     summary: Excluir um grupo
 *     description: Exclui um grupo (apenas o criador pode excluir)
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID do grupo
 *     responses:
 *       200:
 *         description: Grupo excluído com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *       403:
 *         description: Apenas o criador pode excluir o grupo
 *       404:
 *         description: Grupo não encontrado
 *       401:
 *         description: Não autorizado
 */
router.delete(
  "/:groupId",
  validateSchema(idSchema, "params"),
  GroupController.deleteGroup
);

export default router;
