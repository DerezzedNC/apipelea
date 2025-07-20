/**
 * @swagger
 * components:
 *   schemas:
 *     PersonajeBatalla3vs3:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID del personaje
 *         nombre:
 *           type: string
 *           description: Nombre del personaje
 *         vida:
 *           type: number
 *           description: Puntos de vida actuales
 *         escudo:
 *           type: number
 *           description: Puntos de escudo actuales
 *         ataque:
 *           type: number
 *           description: Puntos de ataque
 *       example:
 *         id: "507f1f77bcf86cd799439011"
 *         nombre: "Guerrero"
 *         vida: 100
 *         escudo: 20
 *         ataque: 30
 *     
 *     Turno3vs3:
 *       type: object
 *       properties:
 *         numero:
 *           type: number
 *           description: Número del turno
 *         atacante:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             nombre:
 *               type: string
 *         defensor:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             nombre:
 *               type: string
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
 *         atacante:
 *           id: "507f1f77bcf86cd799439011"
 *           nombre: "Guerrero"
 *         defensor:
 *           id: "507f1f77bcf86cd799439012"
 *           nombre: "Mago"
 *         daño: 30
 *         escudoRestante: 0
 *         vidaRestante: 70
 *     
 *     Ronda3vs3:
 *       type: object
 *       properties:
 *         numero:
 *           type: number
 *           description: Número de la ronda (1, 2 o 3)
 *         personajeA:
 *           $ref: '#/components/schemas/PersonajeBatalla3vs3'
 *         personajeB:
 *           $ref: '#/components/schemas/PersonajeBatalla3vs3'
 *         turnos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Turno3vs3'
 *         ganador:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             nombre:
 *               type: string
 *         finalizada:
 *           type: boolean
 *           description: Si la ronda ha terminado
 *       example:
 *         numero: 1
 *         personajeA:
 *           id: "507f1f77bcf86cd799439011"
 *           nombre: "Guerrero"
 *           vida: 100
 *           escudo: 20
 *           ataque: 30
 *         personajeB:
 *           id: "507f1f77bcf86cd799439012"
 *           nombre: "Mago"
 *           vida: 80
 *           escudo: 10
 *           ataque: 40
 *         turnos: []
 *         finalizada: false
 *     
 *     Batalla3vs3:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID de la batalla
 *         teamA:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PersonajeBatalla3vs3'
 *           description: Equipo A (3 personajes)
 *         teamB:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PersonajeBatalla3vs3'
 *           description: Equipo B (3 personajes)
 *         ordenRondas:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               a:
 *                 type: number
 *                 description: Índice del personaje del Team A (0-2)
 *               b:
 *                 type: number
 *                 description: Índice del personaje del Team B (0-2)
 *           description: Configuración de las 3 rondas
 *         rondas:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Ronda3vs3'
 *         ganadorEquipo:
 *           type: string
 *           enum: ['Team A', 'Team B', 'Empate', null]
 *           description: Equipo ganador de la batalla
 *         finalizada:
 *           type: boolean
 *           description: Si la batalla ha terminado
 *         victoriasTeamA:
 *           type: number
 *           description: Número de victorias del Team A
 *         victoriasTeamB:
 *           type: number
 *           description: Número de victorias del Team B
 *       example:
 *         _id: "507f1f77bcf86cd799439013"
 *         teamA:
 *           - id: "507f1f77bcf86cd799439011"
 *             nombre: "Guerrero"
 *             vida: 100
 *             escudo: 20
 *             ataque: 30
 *           - id: "507f1f77bcf86cd799439012"
 *             nombre: "Mago"
 *             vida: 80
 *             escudo: 10
 *             ataque: 40
 *           - id: "507f1f77bcf86cd799439013"
 *             nombre: "Arquero"
 *             vida: 90
 *             escudo: 15
 *             ataque: 35
 *         teamB:
 *           - id: "507f1f77bcf86cd799439014"
 *             nombre: "Paladín"
 *             vida: 120
 *             escudo: 25
 *             ataque: 25
 *           - id: "507f1f77bcf86cd799439015"
 *             nombre: "Berserker"
 *             vida: 70
 *             escudo: 5
 *             ataque: 50
 *           - id: "507f1f77bcf86cd799439016"
 *             nombre: "Monje"
 *             vida: 85
 *             escudo: 30
 *             ataque: 20
 *         ordenRondas: []
 *         rondas: []
 *         finalizada: false
 *         victoriasTeamA: 0
 *         victoriasTeamB: 0
 *     
 *     ResumenBatalla3vs3:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID de la batalla
 *         teamA:
 *           type: array
 *           items:
 *             type: string
 *           description: Nombres de los personajes del Team A
 *         teamB:
 *           type: array
 *           items:
 *             type: string
 *           description: Nombres de los personajes del Team B
 *         ganador:
 *           type: string
 *           nullable: true
 *           description: Equipo ganador (Team A, Team B, Empate o null si no ha terminado)
 *         rondasJugadas:
 *           type: number
 *           description: Número de rondas completadas
 *         victoriasTeamA:
 *           type: number
 *           description: Victorias del Team A
 *         victoriasTeamB:
 *           type: number
 *           description: Victorias del Team B
 *         finalizada:
 *           type: boolean
 *           description: Si la batalla ha terminado
 *         fechaCreacion:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la batalla
 *       example:
 *         _id: "507f1f77bcf86cd799439013"
 *         teamA: ["Guerrero", "Mago", "Arquero"]
 *         teamB: ["Paladín", "Berserker", "Monje"]
 *         ganador: "Team A"
 *         rondasJugadas: 3
 *         victoriasTeamA: 2
 *         victoriasTeamB: 1
 *         finalizada: true
 *         fechaCreacion: "2024-01-15T10:30:00.000Z"
 *     
 *     CrearBatalla3vs3Request:
 *       type: object
 *       required:
 *         - teamA
 *         - teamB
 *       properties:
 *         teamA:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de 3 IDs de personajes del Team A
 *           example:
 *             - "507f1f77bcf86cd799439011"
 *             - "507f1f77bcf86cd799439012"
 *             - "507f1f77bcf86cd799439013"
 *         teamB:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de 3 IDs de personajes del Team B
 *           example:
 *             - "507f1f77bcf86cd799439014"
 *             - "507f1f77bcf86cd799439015"
 *             - "507f1f77bcf86cd799439016"
 *     

 */

/**
 * @swagger
 * tags:
 *   name: Batallas 3vs3
 *   description: API para gestionar batallas 3 contra 3 entre equipos de personajes
 */





/**
 * @swagger
 * /api/batallas/3vs3/round1/{batallaId}:
 *   post:
 *     summary: Ejecutar turno de la ronda 1
 *     description: |
 *       Ejecuta un turno de la primera ronda de la batalla.
 *       Los personajes atacan alternadamente hasta que uno pierda toda su vida.
 *       El daño se aplica primero al escudo y luego a la vida.
 *     tags: [Batallas 3vs3]
 *     parameters:
 *       - in: path
 *         name: batallaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la batalla
 *         example: "507f1f77bcf86cd799439013"
 *     responses:
 *       200:
 *         description: Turno ejecutado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Turno 1 de ronda 1 ejecutado"
 *                 turno:
 *                   $ref: '#/components/schemas/Turno3vs3'
 *                 ronda:
 *                   $ref: '#/components/schemas/Ronda3vs3'
 *                 batalla:
 *                   type: object
 *                   properties:
 *                     victoriasTeamA:
 *                       type: number
 *                     victoriasTeamB:
 *                       type: number
 *                     finalizada:
 *                       type: boolean
 *       400:
 *         description: Error en la ejecución
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Debes configurar el orden de rondas primero"
 *       404:
 *         description: Batalla no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Batalla no encontrada"
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
 * /api/batallas/3vs3/round2/{batallaId}:
 *   post:
 *     summary: Ejecutar turno de la ronda 2
 *     description: |
 *       Ejecuta un turno de la segunda ronda de la batalla.
 *       Funciona igual que round1 pero con los personajes configurados para la ronda 2.
 *     tags: [Batallas 3vs3]
 *     parameters:
 *       - in: path
 *         name: batallaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la batalla
 *         example: "507f1f77bcf86cd799439013"
 *     responses:
 *       200:
 *         description: Turno ejecutado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Turno 1 de ronda 2 ejecutado"
 *                 turno:
 *                   $ref: '#/components/schemas/Turno3vs3'
 *                 ronda:
 *                   $ref: '#/components/schemas/Ronda3vs3'
 *                 batalla:
 *                   type: object
 *                   properties:
 *                     victoriasTeamA:
 *                       type: number
 *                     victoriasTeamB:
 *                       type: number
 *                     finalizada:
 *                       type: boolean
 *       400:
 *         description: Error en la ejecución
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Debes configurar el orden de rondas primero"
 *       404:
 *         description: Batalla no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Batalla no encontrada"
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
 * /api/batallas/3vs3/round3/{batallaId}:
 *   post:
 *     summary: Ejecutar turno de la ronda 3
 *     description: |
 *       Ejecuta un turno de la tercera ronda de la batalla.
 *       Al finalizar esta ronda se determina el equipo ganador basado en el número de victorias.
 *     tags: [Batallas 3vs3]
 *     parameters:
 *       - in: path
 *         name: batallaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la batalla
 *         example: "507f1f77bcf86cd799439013"
 *     responses:
 *       200:
 *         description: Turno ejecutado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Ronda 3 finalizada"
 *                 turno:
 *                   $ref: '#/components/schemas/Turno3vs3'
 *                 ronda:
 *                   $ref: '#/components/schemas/Ronda3vs3'
 *                 batalla:
 *                   type: object
 *                   properties:
 *                     victoriasTeamA:
 *                       type: number
 *                     victoriasTeamB:
 *                       type: number
 *                     finalizada:
 *                       type: boolean
 *                     ganadorEquipo:
 *                       type: string
 *                       enum: ['Team A', 'Team B', 'Empate']
 *       400:
 *         description: Error en la ejecución
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Debes configurar el orden de rondas primero"
 *       404:
 *         description: Batalla no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: "Batalla no encontrada"
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
 * /api/batallas/3vs3/resumen:
 *   get:
 *     summary: Obtener resumen de todas las batallas 3vs3
 *     description: Devuelve un listado con el resumen de todas las batallas 3vs3 registradas
 *     tags: [Batallas 3vs3]
 *     responses:
 *       200:
 *         description: Lista de batallas 3vs3
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ResumenBatalla3vs3'
 *             example:
 *               - _id: "507f1f77bcf86cd799439013"
 *                 teamA: ["Guerrero", "Mago", "Arquero"]
 *                 teamB: ["Paladín", "Berserker", "Monje"]
 *                 ganador: "Team A"
 *                 rondasJugadas: 3
 *                 victoriasTeamA: 2
 *                 victoriasTeamB: 1
 *                 finalizada: true
 *                 fechaCreacion: "2024-01-15T10:30:00.000Z"
 *               - _id: "507f1f77bcf86cd799439014"
 *                 teamA: ["Espadachín", "Hechicero", "Ladrón"]
 *                 teamB: ["Clérigo", "Bárbaro", "Ranger"]
 *                 ganador: null
 *                 rondasJugadas: 1
 *                 victoriasTeamA: 1
 *                 victoriasTeamB: 0
 *                 finalizada: false
 *                 fechaCreacion: "2024-01-15T11:00:00.000Z"
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