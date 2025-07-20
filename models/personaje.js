const mongoose = require('mongoose');

const personajeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Za-z\s]+$/,
    minlength: 2,
    maxlength: 50
  },
  vida: {
    type: Number,
    required: true,
    min: 1,
    max: 1000
  },
  ataque: {
    type: Number,
    required: true,
    min: 1,
    max: 200
  },
  escudo: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Personaje', personajeSchema);
