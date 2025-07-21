/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para registro, login y gestión de usuarios
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
 *           description: ID único del usuario
 *         nombre:
 *           type: string
 *           description: Nombre de usuario único
 *         rol:
 *           type: string
 *           enum: [admin, usuario]
 *           description: Rol del usuario
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *       example:
 *         id: "507f1f77bcf86cd799439011"
 *         nombre: "usuario1"
 *         rol: "usuario"
 *         createdAt: "2024-01-15T10:30:00.000Z"
 *     
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - password
 *       properties:
 *         nombre:
 *           type: string
 *           minLength: 3
 *           description: Nombre de usuario único
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Contraseña del usuario
 *       example:
 *         nombre: "usuario1"
 *         password: "123456"
 *     
 *     LoginRequest:
 *       type: object
 *       required:
 *         - nombre
 *         - password
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre de usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *       example:
 *         nombre: "usuario1"
 *         password: "123456"
 *     
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           description: Mensaje de confirmación
 *       example:
 *         mensaje: "Usuario registrado correctamente"
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           description: Mensaje de respuesta
 *         token:
 *           type: string
 *           description: Token JWT para autenticación
 *         user:
 *           $ref: '#/components/schemas/User'
 *       example:
 *         mensaje: "Login exitoso"
 *         token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *         user:
 *           id: "507f1f77bcf86cd799439011"
 *           nombre: "usuario1"
 *           rol: "usuario"
 *           createdAt: "2024-01-15T10:30:00.000Z"
 */ 

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             nombre: "usuario1"
 *             password: "123456"
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Error de validación
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             nombre: "usuario1"
 *             password: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Credenciales inválidas
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Autenticación]
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
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Token inválido
 */ 