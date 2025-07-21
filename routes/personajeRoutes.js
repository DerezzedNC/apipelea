const express = require('express');
const router = express.Router();
const {
  crearPersonaje,
  obtenerPersonajes,
  obtenerPersonaje,
  actualizarPersonaje,
  eliminarPersonaje
} = require('../controllers/personajeController');
const authMiddleware = require('../middlewares/authMiddleware');
const verificarRol = require('../middlewares/verificarRol');

/**
 * @swagger
 * /api/personajes:
 *   get:
 *     summary: Obtiene todos los personajes
 *     tags:
 *       - Personajes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de personajes
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Token inválido
 */
router.get('/', authMiddleware, obtenerPersonajes);

/**
 * @swagger
 * /api/personajes/{id}:
 *   get:
 *     summary: Obtiene un personaje por ID
 *     tags:
 *       - Personajes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del personaje
 *     responses:
 *       200:
 *         description: Personaje encontrado
 *       401:
 *         description: Token requerido
 *       403:
 *         description: Token inválido
 *       404:
 *         description: Personaje no encontrado
 */
router.get('/:id', authMiddleware, obtenerPersonaje);

// Rutas protegidas (solo admin puede crear/editar/eliminar)
router.post('/', authMiddleware, verificarRol(['admin']), crearPersonaje);
router.put('/:id', authMiddleware, verificarRol(['admin']), actualizarPersonaje);
router.delete('/:id', authMiddleware, verificarRol(['admin']), eliminarPersonaje);

module.exports = router;
