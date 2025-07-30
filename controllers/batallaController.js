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
    
    // Determinar atacante y defensor
    let atacante, defensor;
    if (esTurnoPar) {
      atacante = batalla.personajeB;
      defensor = batalla.personajeA;
    } else {
      atacante = batalla.personajeA;
      defensor = batalla.personajeB;
    }

    // Verificar que ambos personajes tengan vida
    if (batalla.personajeA.vida <= 0 || batalla.personajeB.vida <= 0) {
      batalla.finalizada = true;
      const ganador = batalla.personajeA.vida > 0 ? batalla.personajeA : batalla.personajeB;
      batalla.ganador = {
        id: ganador.id,
        nombre: ganador.nombre
      };
      await batalla.save();
      
      return res.status(400).json({ 
        mensaje: 'La batalla ya ha finalizado',
        ganador: ganador.nombre
      });
    }

    // Calcular daño
    let daño = atacante.ataque;
    let escudoRestante = defensor.escudo;
    let vidaRestante = defensor.vida;

    // Aplicar daño al escudo primero, luego a la vida
    if (escudoRestante > 0) {
      if (daño <= escudoRestante) {
        escudoRestante -= daño;
        daño = 0; // Todo el daño fue absorbido por el escudo
      } else {
        const dañoRestante = daño - escudoRestante;
        escudoRestante = 0;
        vidaRestante = Math.max(0, vidaRestante - dañoRestante);
        daño = dañoRestante; // Daño que pasó al escudo
      }
    } else {
      vidaRestante = Math.max(0, vidaRestante - daño);
    }

    // Actualizar estado del defensor
    if (esTurnoPar) {
      batalla.personajeA.escudo = escudoRestante;
      batalla.personajeA.vida = vidaRestante;
    } else {
      batalla.personajeB.escudo = escudoRestante;
      batalla.personajeB.vida = vidaRestante;
    }

    // Crear objeto del turno
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
      daño: atacante.ataque, // Daño original del atacante
      escudoRestante,
      vidaRestante
    };

    // Agregar turno al array
    batalla.turnos.push(turno);

    // Verificar si hay ganador
    let ganador = null;
    if (vidaRestante <= 0) {
      batalla.finalizada = true;
      batalla.ganador = {
        id: atacante.id,
        nombre: atacante.nombre
      };
      ganador = atacante.nombre;
    }

    await batalla.save();

    res.status(200).json({
      mensaje: ganador ? `¡${ganador} ha ganado la batalla!` : 'Turno ejecutado',
      turno: turno.numero,
      atacante: {
        nombre: atacante.nombre
      },
      defensor: {
        nombre: defensor.nombre
      },
      daño: turno.daño,
      escudoRestante,
      vidaRestante,
      personajeA: {
        nombre: batalla.personajeA.nombre,
        vida: batalla.personajeA.vida,
        escudo: batalla.personajeA.escudo
      },
      personajeB: {
        nombre: batalla.personajeB.nombre,
        vida: batalla.personajeB.vida,
        escudo: batalla.personajeB.escudo
      },
      ganador: ganador || null,
      batallaFinalizada: batalla.finalizada
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

// POST /api/batallas/:id/turno - Ejecutar turno específico
const ejecutarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: 'ID de batalla inválido' });
    }

    const batalla = await Batalla.findById(id);
    
    if (!batalla) {
      return res.status(404).json({ mensaje: 'Batalla no encontrada' });
    }

    // Verificar que el usuario sea el propietario de la batalla
    if (batalla.userId.toString() !== req.user.id && req.user.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permisos para esta batalla' });
    }

    // Verificar si la batalla ya está finalizada
    if (batalla.finalizada) {
      return res.status(400).json({ 
        mensaje: 'La batalla ya ha finalizado',
        ganador: batalla.ganador?.nombre || 'Sin ganador'
      });
    }

    // Verificar que ambos personajes tengan vida
    if (batalla.personajeA.vida <= 0 || batalla.personajeB.vida <= 0) {
      batalla.finalizada = true;
      const ganador = batalla.personajeA.vida > 0 ? batalla.personajeA : batalla.personajeB;
      batalla.ganador = {
        id: ganador.id,
        nombre: ganador.nombre
      };
      await batalla.save();
      
      return res.status(400).json({ 
        mensaje: 'La batalla ya ha finalizado',
        ganador: ganador.nombre
      });
    }

    // Ejecutar turno
    const turnoNum = batalla.turnos.length + 1;
    const esTurnoPar = turnoNum % 2 === 0;
    
    // Determinar atacante y defensor
    let atacante, defensor;
    if (esTurnoPar) {
      atacante = batalla.personajeB;
      defensor = batalla.personajeA;
    } else {
      atacante = batalla.personajeA;
      defensor = batalla.personajeB;
    }

    // Calcular daño
    let daño = atacante.ataque;
    let escudoRestante = defensor.escudo;
    let vidaRestante = defensor.vida;

    // Aplicar daño al escudo primero, luego a la vida
    if (escudoRestante > 0) {
      if (daño <= escudoRestante) {
        escudoRestante -= daño;
        daño = 0; // Todo el daño fue absorbido por el escudo
      } else {
        const dañoRestante = daño - escudoRestante;
        escudoRestante = 0;
        vidaRestante = Math.max(0, vidaRestante - dañoRestante);
        daño = dañoRestante; // Daño que pasó al escudo
      }
    } else {
      vidaRestante = Math.max(0, vidaRestante - daño);
    }

    // Actualizar estado del defensor
    if (esTurnoPar) {
      batalla.personajeA.escudo = escudoRestante;
      batalla.personajeA.vida = vidaRestante;
    } else {
      batalla.personajeB.escudo = escudoRestante;
      batalla.personajeB.vida = vidaRestante;
    }

    // Crear objeto del turno
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
      daño: atacante.ataque, // Daño original del atacante
      escudoRestante,
      vidaRestante
    };

    // Agregar turno al array
    batalla.turnos.push(turno);

    // Verificar si hay ganador
    let ganador = null;
    if (vidaRestante <= 0) {
      batalla.finalizada = true;
      batalla.ganador = {
        id: atacante.id,
        nombre: atacante.nombre
      };
      ganador = atacante.nombre;
    }

    // Guardar batalla
    await batalla.save();

    // Preparar respuesta
    const respuesta = {
      mensaje: ganador ? `¡${ganador} ha ganado la batalla!` : 'Turno ejecutado',
      turno: turno.numero,
      atacante: {
        nombre: atacante.nombre
      },
      defensor: {
        nombre: defensor.nombre
      },
      daño: turno.daño,
      escudoRestante,
      vidaRestante,
      personajeA: {
        nombre: batalla.personajeA.nombre,
        vida: batalla.personajeA.vida,
        escudo: batalla.personajeA.escudo
      },
      personajeB: {
        nombre: batalla.personajeB.nombre,
        vida: batalla.personajeB.vida,
        escudo: batalla.personajeB.escudo
      },
      ganador: ganador || null,
      batallaFinalizada: batalla.finalizada
    };

    res.status(200).json(respuesta);

  } catch (error) {
    console.error('Error en ejecutarTurno:', error);
    res.status(500).json({ 
      mensaje: 'Error interno del servidor al ejecutar turno',
      error: error.message 
    });
  }
};

module.exports = {
  crearOBatallar,
  resumenBatallas,
  ejecutarTurno
};
