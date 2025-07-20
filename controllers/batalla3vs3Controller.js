const mongoose = require('mongoose');
const Batalla3vs3 = require('../models/batalla3vs3');
const Personaje = require('../models/personaje');

// POST /api/batallas/3vs3/crear
const crearBatalla3vs3 = async (req, res) => {
  try {
    const { teamA, teamB } = req.body;
    if (!Array.isArray(teamA) || teamA.length !== 3 || !Array.isArray(teamB) || teamB.length !== 3) {
      return res.status(400).json({ mensaje: 'Debes proporcionar exactamente 3 IDs para teamA y teamB' });
    }
    const batalla = new Batalla3vs3({ teamA, teamB });
    await batalla.save();
    res.status(201).json({ mensaje: 'Batalla creada exitosamente', id: batalla._id });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// PUT /api/batallas/3vs3/:id/ordenar
const configurarOrdenRondas = async (req, res) => {
  try {
    const { id } = req.params;
    const { ordenRondas } = req.body;

    if (!Array.isArray(ordenRondas) || ordenRondas.length !== 3) {
      return res.status(400).json({ mensaje: 'Debes proporcionar exactamente 3 objetos en ordenRondas' });
    }

    for (const ronda of ordenRondas) {
      if (typeof ronda.a !== 'number' || typeof ronda.b !== 'number') {
        return res.status(400).json({ mensaje: 'Cada objeto en ordenRondas debe tener propiedades numéricas "a" y "b"' });
      }
    }

    const batalla = await Batalla3vs3.findById(id);
    if (!batalla) {
      return res.status(404).json({ mensaje: 'Batalla no encontrada' });
    }

    batalla.ordenRondas = ordenRondas;
    await batalla.save();

    res.status(200).json({ mensaje: 'Orden de rondas configurado correctamente', ordenRondas });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Ejecutar una ronda
const ejecutarRonda = async (req, res) => {
  try {
    const { batallaId, numeroRonda } = req.params;
    const rondaIndex = parseInt(numeroRonda) - 1;

    if (!mongoose.Types.ObjectId.isValid(batallaId)) {
      return res.status(400).json({ mensaje: 'ID de batalla inválido' });
    }

    if (rondaIndex < 0 || rondaIndex > 2) {
      return res.status(400).json({ mensaje: 'Número de ronda debe estar entre 1 y 3' });
    }

    const batalla = await Batalla3vs3.findById(batallaId);
    if (!batalla) return res.status(404).json({ mensaje: 'Batalla no encontrada' });
    if (batalla.finalizada) return res.status(400).json({ mensaje: 'La batalla ya ha finalizado' });

    const config = batalla.ordenRondas[rondaIndex];
    let ronda = batalla.rondas[rondaIndex];

    if (!ronda) {
      const personajesA = await Personaje.find({ _id: { $in: batalla.teamA } });
      const personajesB = await Personaje.find({ _id: { $in: batalla.teamB } });

      const personajeA = personajesA[config.a];
      const personajeB = personajesB[config.b];

      ronda = {
        numero: rondaIndex + 1,
        personajeA: {
          id: personajeA._id.toString(),
          nombre: personajeA.nombre,
          vida: personajeA.vida,
          escudo: personajeA.escudo,
          ataque: personajeA.ataque
        },
        personajeB: {
          id: personajeB._id.toString(),
          nombre: personajeB.nombre,
          vida: personajeB.vida,
          escudo: personajeB.escudo,
          ataque: personajeB.ataque
        },
        turnos: [],
        finalizada: false
      };
      batalla.rondas[rondaIndex] = ronda;
    }

    if (ronda.finalizada) {
      return res.status(400).json({ mensaje: `La ronda ${numeroRonda} ya fue jugada` });
    }

    const turnoNum = ronda.turnos.length + 1;
    const esTurnoPar = turnoNum % 2 === 0;
    const atacante = esTurnoPar ? ronda.personajeB : ronda.personajeA;
    const defensor = esTurnoPar ? ronda.personajeA : ronda.personajeB;

    const daño = atacante.ataque;
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
      ronda.personajeA.escudo = escudoRestante;
      ronda.personajeA.vida = vidaRestante;
    } else {
      ronda.personajeB.escudo = escudoRestante;
      ronda.personajeB.vida = vidaRestante;
    }

    const turno = {
      numero: turnoNum,
      atacante: { id: atacante.id, nombre: atacante.nombre },
      defensor: { id: defensor.id, nombre: defensor.nombre },
      daño,
      escudoRestante,
      vidaRestante
    };

    ronda.turnos.push(turno);

    if (vidaRestante <= 0) {
      ronda.finalizada = true;
      ronda.ganador = { id: atacante.id, nombre: atacante.nombre };
      esTurnoPar ? batalla.victoriasTeamB++ : batalla.victoriasTeamA++;
    }

    const todasFinalizadas = batalla.rondas.filter(r => r && r.finalizada).length === 3;

    if (todasFinalizadas && !batalla.finalizada) {
      batalla.finalizada = true;
      if (batalla.victoriasTeamA > batalla.victoriasTeamB) {
        batalla.ganadorEquipo = 'Team A';
      } else if (batalla.victoriasTeamB > batalla.victoriasTeamA) {
        batalla.ganadorEquipo = 'Team B';
      } else {
        batalla.ganadorEquipo = 'Empate';
      }
    }

    await batalla.save();

    res.json({
      mensaje: ronda.finalizada ? `Ronda ${numeroRonda} finalizada` : `Turno ${turnoNum} ejecutado`,
      turno,
      ronda: {
        numero: ronda.numero,
        personajeA: ronda.personajeA,
        personajeB: ronda.personajeB,
        turnos: ronda.turnos,
        finalizada: ronda.finalizada,
        ganador: ronda.ganador || null
      },
      batalla: {
        victoriasTeamA: batalla.victoriasTeamA,
        victoriasTeamB: batalla.victoriasTeamB,
        finalizada: batalla.finalizada,
        ganadorEquipo: batalla.ganadorEquipo || null
      }
    });

  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// GET /api/batallas/3vs3/resumen
const obtenerResumen = async (req, res) => {
  try {
    const batallas = await Batalla3vs3.find().sort({ createdAt: -1 });
    const resumen = batallas.map(b => ({
      _id: b._id,
      teamA: b.teamA,
      teamB: b.teamB,
      victoriasTeamA: b.victoriasTeamA,
      victoriasTeamB: b.victoriasTeamB,
      ganador: b.ganadorEquipo,
      finalizada: b.finalizada,
      fecha: b.createdAt
    }));
    res.json(resumen);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = {
  crearBatalla3vs3,
  configurarOrdenRondas,
  ejecutarRonda,
  obtenerResumen
};
