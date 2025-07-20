const express = require('express');
const router = express.Router();
const {
  crearPersonaje,
  obtenerPersonajes,
  obtenerPersonaje,
  actualizarPersonaje,
  eliminarPersonaje
} = require('../controllers/personajeController');

// Rutas para personajes
router.post('/', crearPersonaje);
router.get('/', obtenerPersonajes);
router.get('/:id', obtenerPersonaje);
router.put('/:id', actualizarPersonaje);
router.delete('/:id', eliminarPersonaje);

module.exports = router;
