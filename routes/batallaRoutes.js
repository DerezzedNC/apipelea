const express = require('express');
const router = express.Router();
const { crearOBatallar, resumenBatallas } = require('../controllers/batallaController');
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
router.post('/1vs1', authMiddleware, verificarRol(['admin', 'usuario']), crearOBatallar);

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

module.exports = router;
