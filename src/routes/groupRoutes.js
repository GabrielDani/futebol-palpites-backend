import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import GroupController from "../controllers/GroupController.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import { createGroupSchema, idSchema } from "../validations/groupValidation.js";

const router = Router();

router.use(authMiddleware);

router.post(
  "/",
  validateSchema(createGroupSchema),
  GroupController.createGroup
);

router.get("/", GroupController.getAllGroups);

router.post(
  "/join/:groupId",
  validateSchema(idSchema, "params"),
  GroupController.joinGroup
);

router.post(
  "/leave/:groupId",
  validateSchema(idSchema, "params"),
  GroupController.leaveGroup
);

router.delete(
  "/:groupId",
  validateSchema(idSchema, "params"),
  GroupController.deleteGroup
);

export default router;

/**
 * @swagger
 * tags:
 *   name: Grupos
 *   description: Endpoints para gerenciamento de grupos de apostas
 */

/**
 * @swagger
 * /groups:
 *   post:
 *     summary: Cria um novo grupo
 *     description: Cria um novo grupo de apostas com o usuário autenticado como criador
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Meu Grupo"
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Grupo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       400:
 *         description: Dados inválidos ou faltando
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /groups:
 *   get:
 *     summary: Lista todos os grupos
 *     description: Retorna uma lista de grupos públicos ou privados que o usuário pertence
 *     tags: [Grupos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de grupos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *       401:
 *         description: Não autorizado
 */

/**
 * @swagger
 * /groups/join/{groupId}:
 *   post:
 *     summary: Entra em um grupo
 *     description: Permite que o usuário autenticado entre em um grupo público ou privado
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
 *         example: "a1557981-fb2b-4e19-b0ac-b471ef1efa52"
 *     responses:
 *       200:
 *         description: Entrou no grupo com sucesso
 *       400:
 *         description: ID inválido ou senha incorreta
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Grupo não encontrado
 */

/**
 * @swagger
 * /groups/leave/{groupId}:
 *   post:
 *     summary: Sai de um grupo
 *     description: Permite que o usuário autenticado saia de um grupo
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
 *         example: "a1557981-fb2b-4e19-b0ac-b471ef1efa52"
 *     responses:
 *       200:
 *         description: Saiu do grupo com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Grupo não encontrado
 */

/**
 * @swagger
 * /groups/{groupId}:
 *   delete:
 *     summary: Exclui um grupo
 *     description: Permite que o criador do grupo exclua o mesmo
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
 *         example: "a1557981-fb2b-4e19-b0ac-b471ef1efa52"
 *     responses:
 *       204:
 *         description: Grupo excluído com sucesso
 *       400:
 *         description: ID inválido
 *       401:
 *         description: Não autorizado (apenas o criador pode excluir)
 *       404:
 *         description: Grupo não encontrado
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "a1557981-fb2b-4e19-b0ac-b471ef1efa52"
 *         name:
 *           type: string
 *           example: "Grupo dos Campeões"
 *         isPublic:
 *           type: boolean
 *           example: true
 *         creator:
 *           type: string
 *           format: uuid
 *           example: "a1557981-fb2b-4e19-b0ac-b471ef1efa52"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-05-01T10:00:00Z"
 *         membersCount:
 *           type: integer
 *           example: 5
 */
