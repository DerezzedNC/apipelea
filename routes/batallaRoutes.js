const express = require('express');
const router = express.Router();
const { crearOBatallar, resumenBatallas } = require('../controllers/batallaController');

/**
 * @swagger
 * /api/batallas/1vs1:
 *   post:
 *     summary: Crea una nueva batalla 1vs1
 *     tags:
 *       - Batallas 1vs1
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
 */
router.post('/1vs1', crearOBatallar);

/**
 * @swagger
 * /api/batallas:
 *   get:
 *     summary: Obtiene un resumen de todas las batallas 1vs1
 *     tags:
 *       - Batallas 1vs1
 *     responses:
 *       200:
 *         description: Lista de batallas con su estado actual
 */
router.get('/', resumenBatallas);

module.exports = router;
