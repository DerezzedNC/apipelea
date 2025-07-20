/**
 * @swagger
 * components:
 *   schemas:
 *     Personaje:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del personaje
 *         nombre:
 *           type: string
 *           description: Nombre del personaje
 *         vida:
 *           type: number
 *           description: Puntos de vida
 *         ataque:
 *           type: number
 *           description: Puntos de ataque
 *         escudo:
 *           type: number
 *           description: Puntos de escudo
 *       example:
 *         _id: "507f1f77bcf86cd799439011"
 *         nombre: "Guerrero"
 *         vida: 100
 *         ataque: 30
 *         escudo: 20
 *     
 *     CrearPersonajeRequest:
 *       type: object
 *       required: ["nombre", "vida", "ataque", "escudo"]
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del personaje
 *         vida:
 *           type: number
 *           description: Puntos de vida
 *         ataque:
 *           type: number
 *           description: Puntos de ataque
 *         escudo:
 *           type: number
 *           description: Puntos de escudo
 */

/**
 * @swagger
 * tags:
 *   name: Personajes
 *   description: API para gestionar personajes
 */

/**
 * @swagger
 * /api/personajes:
 *   get:
 *     summary: Obtener todos los personajes
 *     description: Devuelve una lista de todos los personajes registrados
 *     tags: [Personajes]
 *     responses:
 *       200:
 *         description: Lista de personajes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Personaje'
 *             example:
 *               - _id: "507f1f77bcf86cd799439011"
 *                 nombre: "Guerrero"
 *                 vida: 100
 *                 ataque: 30
 *                 escudo: 20
 *               - _id: "507f1f77bcf86cd799439012"
 *                 nombre: "Mago"
 *                 vida: 80
 *                 ataque: 40
 *                 escudo: 10
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error interno del servidor"
 *   
 *   post:
 *     summary: Crear un nuevo personaje
 *     description: Crea un nuevo personaje con los datos proporcionados
 *     tags: [Personajes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearPersonajeRequest'
 *           example:
 *             nombre: "Guerrero"
 *             vida: 100
 *             ataque: 30
 *             escudo: 20
 *     responses:
 *       201:
 *         description: Personaje creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Personaje'
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "El nombre es requerido"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error interno del servidor"
 */

/**
 * @swagger
 * /api/personajes/{id}:
 *   get:
 *     summary: Obtener un personaje por ID
 *     description: Devuelve los datos de un personaje específico
 *     tags: [Personajes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del personaje
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Personaje encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Personaje'
 *       404:
 *         description: Personaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Personaje no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error interno del servidor"
 *   
 *   put:
 *     summary: Actualizar un personaje
 *     description: Actualiza los datos de un personaje existente
 *     tags: [Personajes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del personaje
 *         example: "507f1f77bcf86cd799439011"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearPersonajeRequest'
 *           example:
 *             nombre: "Guerrero Mejorado"
 *             vida: 120
 *             ataque: 35
 *             escudo: 25
 *     responses:
 *       200:
 *         description: Personaje actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Personaje'
 *       404:
 *         description: Personaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Personaje no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error interno del servidor"
 *   
 *   delete:
 *     summary: Eliminar un personaje
 *     description: Elimina un personaje de la base de datos
 *     tags: [Personajes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del personaje
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Personaje eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Personaje eliminado exitosamente"
 *       404:
 *         description: Personaje no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Personaje no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Error interno del servidor"
 */ 