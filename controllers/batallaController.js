const mongoose = require('mongoose');
const Batalla = require('../models/batalla');
const Personaje = require('../models/personaje');

// POST /api/batallas/1vs1
const crearOBatallar = async (req, res) => {
  try {
    const { personajeA, personajeB } = req.body;

    if (!personajeA || !personajeB) {
      return res.status(400).json({ mensaje: 'Debes proporcionar personajeA y personajeB' });
    }

    if (!mongoose.Types.ObjectId.isValid(personajeA) || !mongoose.Types.ObjectId.isValid(personajeB)) {
      return res.status(400).json({ mensaje: 'IDs de personajes inválidos' });
    }

    const pA = await Personaje.findById(personajeA);
    const pB = await Personaje.findById(personajeB);

    if (!pA || !pB) {
      return res.status(404).json({ mensaje: 'Personaje no encontrado' });
    }

    let batalla = await Batalla.findOne({
      'personajeA.id': pA._id,
      'personajeB.id': pB._id
    });

    // ✅ Verificar si la batalla ya existe y fue finalizada
    if (batalla && batalla.finalizada) {
      return res.status(400).json({
        mensaje: `La batalla entre ${pA.nombre} y ${pB.nombre} ya ha finalizado.`
      });
    }

    // ✅ Si no existe, la creamos
    if (!batalla) {
      batalla = new Batalla({
        personajeA: {
          id: pA._id,
          nombre: pA.nombre,
          vida: pA.vida,
          escudo: pA.escudo,
          ataque: pA.ataque
        },
        personajeB: {
          id: pB._id,
          nombre: pB.nombre,
          vida: pB.vida,
          escudo: pB.escudo,
          ataque: pB.ataque
        },
        turnos: [],
        finalizada: false,
        userId: req.user.id
      });

      await batalla.save();

      return res.status(201).json({
        mensaje: 'Batalla creada exitosamente',
        batalla
      });
    }

    // ⚔️ Ejecutar turno
    const turnoNum = batalla.turnos.length + 1;
    const esTurnoPar = turnoNum % 2 === 0;
    let atacante = esTurnoPar ? batalla.personajeB : batalla.personajeA;
    let defensor = esTurnoPar ? batalla.personajeA : batalla.personajeB;

    let daño = atacante.ataque;
    let escudoRestante = defensor.escudo;
    let vidaRestante = defensor.vida;

    if (escudoRestante > 0) {
      if (daño <= escudoRestante) {
        escudoRestante -= daño;
      } else {
        const dañoRestante = daño - escudoRestante;
        escudoRestante = 0;
        vidaRestante = Math.max(0, vidaRestante - dañoRestante);
      }
    } else {
      vidaRestante = Math.max(0, vidaRestante - daño);
    }

    if (esTurnoPar) {
      batalla.personajeA.escudo = escudoRestante;
      batalla.personajeA.vida = vidaRestante;
    } else {
      batalla.personajeB.escudo = escudoRestante;
      batalla.personajeB.vida = vidaRestante;
    }

    const turno = {
      numero: turnoNum,
      atacante: {
        id: atacante.id,
        nombre: atacante.nombre
      },
      defensor: {
        id: defensor.id,
        nombre: defensor.nombre
      },
      daño,
      escudoRestante,
      vidaRestante
    };

    batalla.turnos.push(turno);

    let ganador = null;
    if (vidaRestante <= 0) {
      batalla.finalizada = true;
      ganador = atacante.nombre;
    }

    await batalla.save();

    res.status(200).json({
      mensaje: ganador ? `¡${ganador} ha ganado la batalla!` : 'Turno ejecutado',
      personajeA: batalla.personajeA,
      personajeB: batalla.personajeB,
      turno,
      ganador: ganador || null
    });

  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// GET /api/batallas
const resumenBatallas = async (req, res) => {
  try {
    let query = {};
    
    // Si es usuario normal, solo ver sus batallas
    if (req.user.rol === 'usuario') {
      query.userId = req.user.id;
    }
    
    const batallas = await Batalla.find(query).sort({ createdAt: -1 });
    const resumen = batallas.map(b => ({
      _id: b._id,
      personajeA: b.personajeA.nombre,
      personajeB: b.personajeB.nombre,
      turnos: b.turnos.length,
      ganador: b.finalizada ? (
        b.turnos.length > 0 && b.turnos[b.turnos.length - 1].vidaRestante <= 0
          ? b.turnos[b.turnos.length - 1].atacante.nombre
          : null
      ) : null
    }));
    res.json(resumen);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = {
  crearOBatallar,
  resumenBatallas
};
