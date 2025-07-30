const Personaje = require('../models/personaje');
const Batalla = require('../models/batalla');

const crearBatalla1vs1 = async (req, res) => {
  try {
    const { personajeA, personajeB } = req.body;

    const atacante = await Personaje.findById(personajeA);
    const defensor = await Personaje.findById(personajeB);

    if (!atacante || !defensor) {
      return res.status(404).json({ mensaje: 'Personaje no encontrado' });
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
      ganador: null
    });

    await nuevaBatalla.save();

    res.status(201).json({
      mensaje: 'Batalla creada correctamente',
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
