const express = require('express');
const router = express.Router();
const {
  crearBatalla3vs3,
  configurarOrdenRondas,
  ejecutarRonda,
  obtenerResumen
} = require('../controllers/batalla3vs3Controller');
const authMiddleware = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/verificarRol');

/**
 * @swagger
 * /api/batallas/3vs3/{id}/ordenar:
 *   put:
 *     summary: Configura el orden de peleadores para cada ronda de una batalla 3vs3
 *     tags: [Batallas 3vs3]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la batalla
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ordenRondas:
 *                 type: array
 *                 description: Lista de 3 objetos con el orden de peleadores para cada ronda
 *                 items:
 *                   type: object
 *                   properties:
 *                     a:
 *                       type: number
 *                     b:
 *                       type: number
 *                 example:
 *                   - { "a": 1, "b": 2 }
 *                   - { "a": 3, "b": 4 }
 *                   - { "a": 5, "b": 6 }
 *     responses:
 *       200:
 *         description: Orden configurado correctamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Batalla no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id/ordenar', authMiddleware, verificarRol(['admin', 'usuario']), (req, res) => {
  req.params.id = req.params.id;
  configurarOrdenRondas(req, res);
});

/**
 * @swagger
 * /api/batallas/3vs3/crear:
 *   post:
 *     summary: Crea una nueva batalla 3vs3
 *     tags: [Batallas 3vs3]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamA:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de personajes del equipo A
 *               teamB:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: IDs de personajes del equipo B
 *             required:
 *               - teamA
 *               - teamB
 *             example:
 *               teamA: ["64e9df60d81f892b6215a101", "64e9df60d81f892b6215a102", "64e9df60d81f892b6215a103"]
 *               teamB: ["64e9df60d81f892b6215a104", "64e9df60d81f892b6215a105", "64e9df60d81f892b6215a106"]
 *     responses:
 *       201:
 *         description: Batalla creada exitosamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Token inválido
 */
router.post('/crear', authMiddleware, verificarRol(['admin', 'usuario']), crearBatalla3vs3);

/**
 * @swagger
 * /api/batallas/3vs3/round1/{batallaId}:
 *   post:
 *     summary: Ejecuta la ronda 1 de una batalla 3vs3
 *     tags: [Batallas 3vs3]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batallaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la batalla
 *     responses:
 *       200:
 *         description: Turno ejecutado o ronda finalizada
 *       400:
 *         description: Error de validación o ronda ya finalizada
 *       401:
 *         description: No autorizado
 */
router.post('/round1/:batallaId', authMiddleware, verificarRol(['admin', 'usuario']), (req, res) => {
  req.params.numeroRonda = 1;
  ejecutarRonda(req, res);
});

/**
 * @swagger
 * /api/batallas/3vs3/round2/{batallaId}:
 *   post:
 *     summary: Ejecuta la ronda 2 de una batalla 3vs3
 *     tags: [Batallas 3vs3]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batallaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la batalla
 *     responses:
 *       200:
 *         description: Turno ejecutado o ronda finalizada
 *       400:
 *         description: Error de validación o ronda ya finalizada
 *       401:
 *         description: No autorizado
 */
router.post('/round2/:batallaId', authMiddleware, verificarRol(['admin', 'usuario']), (req, res) => {
  req.params.numeroRonda = 2;
  ejecutarRonda(req, res);
});

/**
 * @swagger
 * /api/batallas/3vs3/round3/{batallaId}:
 *   post:
 *     summary: Ejecuta la ronda 3 de una batalla 3vs3
 *     tags: [Batallas 3vs3]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batallaId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la batalla
 *     responses:
 *       200:
 *         description: Turno ejecutado o ronda finalizada
 *       400:
 *         description: Error de validación o ronda ya finalizada
 *       401:
 *         description: No autorizado
 */
router.post('/round3/:batallaId', authMiddleware, verificarRol(['admin', 'usuario']), (req, res) => {
  req.params.numeroRonda = 3;
  ejecutarRonda(req, res);
});

/**
 * @swagger
 * /api/batallas/3vs3/resumen:
 *   get:
 *     summary: Obtiene un resumen de todas las batallas 3vs3
 *     tags: [Batallas 3vs3]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de batallas con su estado actual
 *       401:
 *         description: No autorizado
 */
router.get('/resumen', authMiddleware, verificarRol(['admin', 'usuario']), obtenerResumen);

module.exports = router;
