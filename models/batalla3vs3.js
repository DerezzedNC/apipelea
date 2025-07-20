const mongoose = require('mongoose');

const personajeSchema = new mongoose.Schema({
  id: String,
  nombre: String,
  vida: Number,
  escudo: Number,
  ataque: Number
}, { _id: false });

const turnoSchema = new mongoose.Schema({
  numero: Number,
  atacante: {
    id: String,
    nombre: String
  },
  defensor: {
    id: String,
    nombre: String
  },
  daño: Number,
  escudoRestante: Number,
  vidaRestante: Number
}, { _id: false });

const rondaSchema = new mongoose.Schema({
  numero: Number,
  personajeA: personajeSchema,
  personajeB: personajeSchema,
  turnos: [turnoSchema],
  finalizada: Boolean,
  ganador: {
    id: String,
    nombre: String
  }
}, { _id: false });

// ✅ Solución clave: usamos objetos internos en lugar de arrays paralelos
const batalla3vs3Schema = new mongoose.Schema({
  teamA: {
    type: [String],
    index: false // Desactiva índices en arrays paralelos
  },
  teamB: {
    type: [String],
    index: false
  },
  ordenRondas: [{
    a: Number,
    b: Number
  }],
  rondas: [rondaSchema],
  finalizada: { type: Boolean, default: false },
  victoriasTeamA: { type: Number, default: 0 },
  victoriasTeamB: { type: Number, default: 0 },
  ganadorEquipo: String
}, { timestamps: true });

module.exports = mongoose.model('Batalla3vs3', batalla3vs3Schema);

