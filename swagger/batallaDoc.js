/**
 * @swagger
 * tags:
 *   name: Batallas 1vs1
 *   description: API para gestionar batallas 1 contra 1
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Turno:
 *       type: object
 *       properties:
 *         numero:
 *           type: number
 *           description: Número del turno
 *         atacante:
 *           type: string
 *           description: ID del personaje atacante
 *         defensor:
 *           type: string
 *           description: ID del personaje defensor
 *         daño:
 *           type: number
 *           description: Daño aplicado
 *         escudoRestante:
 *           type: number
 *           description: Escudo restante del defensor
 *         vidaRestante:
 *           type: number
 *           description: Vida restante del defensor
 *       example:
 *         numero: 1
 *         atacante: "507f1f77bcf86cd799439011"
 *         defensor: "507f1f77bcf86cd799439012"
 *         daño: 30
 *         escudoRestante: 0
 *         vidaRestante: 70
 *     Batalla:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID de la batalla
 *         personajeA:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             nombre:
 *               type: string
 *             vida:
 *               type: number
 *             escudo:
 *               type: number
 *             ataque:
 *               type: number
 *         personajeB:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             nombre:
 *               type: string
 *             vida:
 *               type: number
 *             escudo:
 *               type: number
 *             ataque:
 *               type: number
 *         turnos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Turno'
 *         finalizada:
 *           type: boolean
 *       example:
 *         _id: "507f1f77bcf86cd799439013"
 *         personajeA:
 *           _id: "507f1f77bcf86cd799439011"
 *           nombre: "Guerrero"
 *           vida: 100
 *           escudo: 20
 *           ataque: 30
 *         personajeB:
 *           _id: "507f1f77bcf86cd799439012"
 *           nombre: "Mago"
 *           vida: 80
 *           escudo: 10
 *           ataque: 40
 *         turnos: []
 *         finalizada: false
 *     CrearBatallaRequest:
 *       type: object
 *       required:
 *         - personajeA
 *         - personajeB
 *       properties:
 *         personajeA:
 *           type: string
 *           description: ID del primer personaje
 *         personajeB:
 *           type: string
 *           description: ID del segundo personaje
 *       example:
 *         personajeA: "507f1f77bcf86cd799439011"
 *         personajeB: "507f1f77bcf86cd799439012"
 */

/**
 * @swagger
 * /api/batallas/1vs1:
 *   post:
 *     summary: Crear una batalla 1vs1 o ejecutar un turno
 *     description: |
 *       Si no existe una batalla activa entre los personajes, la crea. Si ya existe, ejecuta el siguiente turno alternando atacante y defensor. El daño se aplica primero al escudo y luego a la vida. Cuando uno llega a 0 de vida, la batalla se elimina y se informa el ganador.
 *     tags: [Batallas 1vs1]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearBatallaRequest'
 *           example:
 *             personajeA: "507f1f77bcf86cd799439011"
 *             personajeB: "507f1f77bcf86cd799439012"
 *     responses:
 *       201:
 *         description: Batalla creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Batalla creada exitosamente"
 *                 batalla:
 *                   $ref: '#/components/schemas/Batalla'
 *       200:
 *         description: Turno ejecutado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "¡Guerrero ha ganado la batalla!"
 *                 personajeA:
 *                   $ref: '#/components/schemas/Batalla/properties/personajeA'
 *                 personajeB:
 *                   $ref: '#/components/schemas/Batalla/properties/personajeB'
 *                 turno:
 *                   $ref: '#/components/schemas/Turno'
 *                 ganador:
 *                   type: string
 *                   nullable: true
 *                   example: "Guerrero"
 *       400:
 *         description: Error en la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Debes proporcionar personajeA y personajeB"
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

/**
 * @swagger
 * /api/batallas:
 *   get:
 *     summary: Obtener resumen de todas las batallas 1vs1
 *     description: Devuelve un listado con el resumen de todas las batallas 1vs1 registradas, incluyendo nombre de los personajes, cantidad de turnos y ganador.
 *     tags: [Batallas 1vs1]
 *     responses:
 *       200:
 *         description: Lista de batallas 1vs1
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   personajeA:
 *                     type: string
 *                   personajeB:
 *                     type: string
 *                   turnos:
 *                     type: number
 *                   ganador:
 *                     type: string
 *                     nullable: true
 *             example:
 *               - _id: "507f1f77bcf86cd799439013"
 *                 personajeA: "Guerrero"
 *                 personajeB: "Mago"
 *                 turnos: 5
 *                 ganador: "Guerrero"
 *               - _id: "507f1f77bcf86cd799439014"
 *                 personajeA: "Paladín"
 *                 personajeB: "Monje"
 *                 turnos: 3
 *                 ganador: null
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