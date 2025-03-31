import { Router } from "express";
import AuthController from "../controllers/AuthController.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import { loginSchema } from "../validations/authValidation.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Endpoints para gerenciamento de autenticação
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     description: Autentica um usuário e retorna tokens de acesso e refresh
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nickname
 *               - password
 *             properties:
 *               nickname:
 *                 type: string
 *                 example: "usuario"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SenhaSegura123"
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 refreshToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Dados inválidos ou faltando
 *       401:
 *         description: Credenciais inválidas
 */
router.post("/login", validateSchema(loginSchema), AuthController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Realiza logout do usuário
 *     description: Invalida o token de refresh do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Token inválido ou não fornecido
 */
router.post("/logout", AuthController.logout);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renova o token de acesso
 *     description: Gera um novo token de acesso usando o refresh token
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Refresh token inválido ou faltando
 *       401:
 *         description: Refresh token expirado ou inválido
 */
router.post("/refresh", AuthController.refreshToken);

export default router;
