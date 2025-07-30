let batallaId = null;
let rondaActual = 1;
let personajesData = [];

// ✅ 1. Inicializar batalla 3vs3
function inicializarBatalla3vs3() {
  batallaId = localStorage.getItem("batallaId");
  if (!batallaId) {
    alert("No se encontró ID de batalla. Regresa a la selección de equipos.");
    window.location.href = "batalla.html";
    return;
  }
  
  cargarPersonajes();
  mostrarEstadoBatalla();
}

// ✅ 2. Cargar personajes
async function cargarPersonajes() {
  try {
    const response = await fetch("https://apipelea.onrender.com/api/personajes", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al cargar personajes');
    }

    personajesData = await response.json();
    console.log("Personajes cargados:", personajesData);
  } catch (error) {
    console.error("Error al cargar personajes:", error);
  }
}

// ✅ 3. Mostrar estado de la batalla
async function mostrarEstadoBatalla() {
  try {
    const response = await fetch(`https://apipelea.onrender.com/api/batallas/3vs3/${batallaId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al cargar estado de batalla');
    }

    const batalla = await response.json();
    console.log("Estado de batalla:", batalla);

    const estadoDiv = document.getElementById("estado-batalla");
    if (estadoDiv) {
      estadoDiv.innerHTML = `
        <h3 style="color: #ffaa00;">Estado de la Batalla 3vs3</h3>
        <div style="display: flex; justify-content: space-around; margin: 20px 0;">
          <div style="background: #004422; padding: 15px; border-radius: 10px; border: 2px solid #00ff88;">
            <strong style="color: #00ff88;">Team A</strong><br>
            <small>Victorias: ${batalla.victoriasTeamA || 0}</small>
          </div>
          <div style="background: #442200; padding: 15px; border-radius: 10px; border: 2px solid #ffaa00;">
            <strong style="color: #ffaa00;">Team B</strong><br>
            <small>Victorias: ${batalla.victoriasTeamB || 0}</small>
          </div>
        </div>
        <p style="text-align: center; color: #ffcc00;">
          <strong>Ronda Actual: ${rondaActual}/3</strong>
        </p>
        ${batalla.finalizada ? `<p style="text-align: center; color: #00ff88; font-weight: bold;">🏆 ¡${batalla.ganadorEquipo} ha ganado la batalla! 🏆</p>` : ''}
      `;
    }
  } catch (error) {
    console.error("Error al mostrar estado:", error);
  }
}

// ✅ 4. Ejecutar turno de ronda
async function ejecutarTurnoRonda() {
  try {
    const response = await fetch(`https://apipelea.onrender.com/api/batallas/3vs3/${batallaId}/ronda/${rondaActual}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await response.json();
    console.log("Respuesta del servidor:", data);

    if (response.ok) {
      mostrarResultadoRonda(data);
      
      // Si la ronda finalizó, pasar a la siguiente
      if (data.ronda && data.ronda.finalizada) {
        rondaActual++;
        if (rondaActual > 3) {
          alert("¡Batalla completada!");
          mostrarEstadoBatalla();
        } else {
          alert(`Ronda ${rondaActual - 1} finalizada. Preparando ronda ${rondaActual}...`);
          mostrarEstadoBatalla();
        }
      }
    } else {
      alert("Error: " + (data.message || data.mensaje));
    }
  } catch (error) {
    console.error("Error al ejecutar turno:", error);
    alert("Error de conexión con el servidor");
  }
}

// ✅ 5. Mostrar resultado de la ronda
function mostrarResultadoRonda(data) {
  const resultadoDiv = document.getElementById("resultado-ronda");
  if (!resultadoDiv) return;

  const ronda = data.ronda || {};
  const turno = data.turno || {};
  const batalla = data.batalla || {};

  resultadoDiv.innerHTML = `
    <h3 style="color: #ffaa00;">${data.mensaje || "Turno ejecutado"}</h3>
    
    <div style="display: flex; justify-content: space-around; margin: 20px 0;">
      <div style="background: #004422; padding: 15px; border-radius: 10px; border: 2px solid #00ff88;">
        <strong style="color: #00ff88;">${ronda.personajeA?.nombre || 'Jugador A'}</strong><br>
        <small>Vida: ${ronda.personajeA?.vida || 0} | Ataque: ${ronda.personajeA?.ataque || 0} | Escudo: ${ronda.personajeA?.escudo || 0}</small>
      </div>
      <div style="background: #442200; padding: 15px; border-radius: 10px; border: 2px solid #ffaa00;">
        <strong style="color: #ffaa00;">${ronda.personajeB?.nombre || 'Jugador B'}</strong><br>
        <small>Vida: ${ronda.personajeB?.vida || 0} | Ataque: ${ronda.personajeB?.ataque || 0} | Escudo: ${ronda.personajeB?.escudo || 0}</small>
      </div>
    </div>
    
    <div style="background: #001d17; padding: 15px; border-radius: 10px; border: 2px solid #00ff88; margin: 20px 0;">
      <h4 style="color: #ffcc00; margin: 0 0 10px 0;">Detalles del Turno</h4>
      <p style="color: #00ff88; margin: 5px 0;">
        <strong>Atacante:</strong> ${turno.atacante?.nombre || 'N/A'}
      </p>
      <p style="color: #ffaa00; margin: 5px 0;">
        <strong>Defensor:</strong> ${turno.defensor?.nombre || 'N/A'}
      </p>
      <p style="color: #ffcc00; margin: 5px 0;">
        <strong>Daño:</strong> ${turno.daño || 0}
      </p>
      <p style="color: #00ff88; margin: 5px 0;">
        <strong>Vida Restante:</strong> ${turno.vidaRestante || 0}
      </p>
      <p style="color: #ffaa00; margin: 5px 0;">
        <strong>Escudo Restante:</strong> ${turno.escudoRestante || 0}
      </p>
    </div>
    
    ${ronda.ganador ? `<p style="text-align: center; color: #00ff88; font-weight: bold;">🏆 ¡${ronda.ganador.nombre} ha ganado la ronda! 🏆</p>` : ''}
    
    <div style="background: #001d17; padding: 15px; border-radius: 10px; border: 2px solid #ffaa00; margin: 20px 0;">
      <h4 style="color: #ffcc00; margin: 0 0 10px 0;">Estado de la Batalla</h4>
      <p style="color: #00ff88; margin: 5px 0;">
        <strong>Team A:</strong> ${batalla.victoriasTeamA || 0} victorias
      </p>
      <p style="color: #ffaa00; margin: 5px 0;">
        <strong>Team B:</strong> ${batalla.victoriasTeamB || 0} victorias
      </p>
      ${batalla.ganadorEquipo ? `<p style="color: #00ff88; font-weight: bold;">🏆 ¡${batalla.ganadorEquipo} ha ganado la batalla! 🏆</p>` : ''}
    </div>
  `;
}

// ✅ 6. Inicializar cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
  inicializarBatalla3vs3();
}); 