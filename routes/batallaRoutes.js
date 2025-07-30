const express = require('express');
const router = express.Router();
const { crearOBatallar, resumenBatallas, ejecutarTurno } = require('../controllers/batallaController');
const { crearBatalla1vs1 } = require('../controllers/batalla1vs1Controller');
const authMiddleware = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/verificarRol');

/**
 * @swagger
 * /api/batallas/1vs1:
 *   post:
 *     summary: Crea una nueva batalla 1vs1
 *     tags:
 *       - Batallas 1vs1
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personajeA:
 *                 type: string
 *                 description: ID del primer personaje
 *               personajeB:
 *                 type: string
 *                 description: ID del segundo personaje
 *             required:
 *               - personajeA
 *               - personajeB
 *             example:
 *               personajeA: "64e9df60d81f892b6215a101"
 *               personajeB: "64e9df60d81f892b6215a102"
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
router.post('/1vs1', authMiddleware, verificarRol(['admin', 'usuario']), crearBatalla1vs1);

/**
 * @swagger
 * /api/batallas:
 *   get:
 *     summary: Obtiene un resumen de todas las batallas 1vs1
 *     tags:
 *       - Batallas 1vs1
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de batallas con su estado actual
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Token inválido
 */
router.get('/', authMiddleware, verificarRol(['admin', 'usuario']), resumenBatallas);

/**
 * @swagger
 * /api/batallas/{id}/turno:
 *   post:
 *     summary: Ejecuta un turno específico de una batalla
 *     tags:
 *       - Batallas 1vs1
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la batalla
 *     responses:
 *       200:
 *         description: Turno ejecutado exitosamente
 *       400:
 *         description: Error de validación o batalla finalizada
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Token inválido o sin permisos
 *       404:
 *         description: Batalla no encontrada
 */
router.post('/:id/turno', authMiddleware, verificarRol(['admin', 'usuario']), ejecutarTurno);

module.exports = router;
