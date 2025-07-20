const mongoose = require('mongoose');

const turnoSchema = new mongoose.Schema({
  numero: {
    type: Number,
    required: true
  },
  atacante: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Personaje',
      required: true
    },
    nombre: {
      type: String,
      required: true
    }
  },
  defensor: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Personaje',
      required: true
    },
    nombre: {
      type: String,
      required: true
    }
  },
  daño: {
    type: Number,
    required: true,
    min: 0
  },
  escudoRestante: {
    type: Number,
    required: true,
    min: 0
  },
  vidaRestante: {
    type: Number,
    required: true,
    min: 0
  }
});

const personajeBatallaSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Personaje',
    required: true
  },
  nombre: {
    type: String,
    required: true
  },
  vida: {
    type: Number,
    required: true,
    min: 0
  },
  escudo: {
    type: Number,
    required: true,
    min: 0
  },
  ataque: {
    type: Number,
    required: true,
    min: 0
  }
});

const batallaSchema = new mongoose.Schema({
  personajeA: {
    type: personajeBatallaSchema,
    required: true
  },
  personajeB: {
    type: personajeBatallaSchema,
    required: true
  },
  turnos: {
    type: [turnoSchema],
    default: []
  },
  ganador: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Personaje'
    },
    nombre: {
      type: String
    }
  },
  finalizada: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índice compuesto para evitar batallas duplicadas entre los mismos personajes
batallaSchema.index({ 'personajeA.id': 1, 'personajeB.id': 1 }, { unique: true });

module.exports = mongoose.model('Batalla', batallaSchema);

