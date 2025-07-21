const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de usuario único
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Contraseña del usuario
 *             required:
 *               - nombre
 *               - password
 *             example:
 *               nombre: "usuario1"
 *               password: "123456"
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Usuario registrado correctamente"
 *       400:
 *         description: Error de validación
 */
router.post('/register', register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre de usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *             required:
 *               - nombre
 *               - password
 *             example:
 *               nombre: "usuario1"
 *               password: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags:
 *       - Autenticación
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Token inválido
 */
router.get('/me', authMiddleware, getProfile);

module.exports = router; 