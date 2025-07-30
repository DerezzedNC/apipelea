const Personaje = require('../models/personaje');
const Batalla = require('../models/batalla');

const crearBatalla1vs1 = async (req, res) => {
  try {
    const { personajeA, personajeB } = req.body;

    if (!personajeA || !personajeB) {
      return res.status(400).json({ mensaje: 'Debes proporcionar personajeA y personajeB' });
    }

    const atacante = await Personaje.findById(personajeA);
    const defensor = await Personaje.findById(personajeB);

    if (!atacante || !defensor) {
      return res.status(404).json({ mensaje: 'Personaje no encontrado' });
    }

    // Verificar si ya existe una batalla entre estos personajes
    const batallaExistente = await Batalla.findOne({
      'personajeA.id': atacante._id,
      'personajeB.id': defensor._id
    });

    if (batallaExistente) {
      return res.status(400).json({ 
        mensaje: 'Ya existe una batalla entre estos personajes',
        batallaId: batallaExistente._id
      });
    }

    const nuevoTurno = {
      numero: 1,
      atacante: {
        id: atacante._id,
        nombre: atacante.nombre,
      },
      defensor: {
        id: defensor._id,
        nombre: defensor.nombre,
      },
      daño: 0,
      escudoRestante: defensor.escudo,
      vidaRestante: defensor.vida
    };

    const nuevaBatalla = new Batalla({
      personajeA: {
        id: atacante._id,
        nombre: atacante.nombre,
        vida: atacante.vida,
        escudo: atacante.escudo,
        ataque: atacante.ataque
      },
      personajeB: {
        id: defensor._id,
        nombre: defensor.nombre,
        vida: defensor.vida,
        escudo: defensor.escudo,
        ataque: defensor.ataque
      },
      turnos: [nuevoTurno],
      ganador: null,
      userId: req.user.id // ✅ Agregar el userId requerido
    });

    await nuevaBatalla.save();

    res.status(201).json({
      mensaje: 'Batalla creada correctamente',
      _id: nuevaBatalla._id,
      batalla: {
        personajeA: nuevaBatalla.personajeA,
        personajeB: nuevaBatalla.personajeB,
        turno: nuevoTurno,
        ganador: null
      }
    });

  } catch (error) {
    console.error('Error al crear batalla 1vs1:', error);
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = { crearBatalla1vs1 };
