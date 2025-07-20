const mongoose = require('mongoose');
const Personaje = require('../models/personaje');

// Crear un nuevo personaje
const crearPersonaje = async (req, res) => {
  try {
    const personaje = new Personaje(req.body);
    const personajeGuardado = await personaje.save();
    res.status(201).json(personajeGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Obtener todos los personajes
const obtenerPersonajes = async (req, res) => {
  try {
    const personajes = await Personaje.find();
    res.json(personajes);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Obtener un personaje por ID
const obtenerPersonaje = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ mensaje: 'ID inválido' });
    }
    
    const personaje = await Personaje.findById(req.params.id);
    if (!personaje) {
      return res.status(404).json({ mensaje: 'Personaje no encontrado' });
    }
    res.json(personaje);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar un personaje
const actualizarPersonaje = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ mensaje: 'ID inválido' });
    }
    
    const personaje = await Personaje.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!personaje) {
      return res.status(404).json({ mensaje: 'Personaje no encontrado' });
    }
    res.json(personaje);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Eliminar un personaje
const eliminarPersonaje = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ mensaje: 'ID inválido' });
    }
    
    const personaje = await Personaje.findByIdAndDelete(req.params.id);
    if (!personaje) {
      return res.status(404).json({ mensaje: 'Personaje no encontrado' });
    }
    res.json({ mensaje: 'Personaje eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = {
  crearPersonaje,
  obtenerPersonajes,
  obtenerPersonaje,
  actualizarPersonaje,
  eliminarPersonaje
};
