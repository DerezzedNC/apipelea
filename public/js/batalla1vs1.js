let personajeAId = null;
let personajeBId = null;
let batallaIniciada = false;
let personajesData = [];

// ✅ 1. Cargar personajes desde la API
async function cargarPersonajes() {
  try {
    const response = await fetch("https://apipelea.onrender.com/api/personajes", {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al cargar personajes');
    }

    personajesData = await response.json();
    console.log("Personajes cargados:", personajesData);

    const panel = document.getElementById("personajes");
    panel.innerHTML = ''; // Limpiar contenedor

    const personajesLimitados = personajesData.slice(0, 10);
    
    personajesLimitados.forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("personaje");
      div.innerHTML = `
        <img src="${p.imagen || 'https://via.placeholder.com/80'}" alt="${p.nombre}" />
        <p>${p.nombre}</p>
        <small>HP: ${p.vida} | ATK: ${p.ataque} | DEF: ${p.defensa} | ESC: ${p.escudo || 0}</small>
        <div class="botones-seleccion">
          <button class="btn-seleccion" data-equipo="A" data-id="${p._id}" data-nombre="${p.nombre}">Elegir para A</button>
          <button class="btn-seleccion" data-equipo="B" data-id="${p._id}" data-nombre="${p.nombre}">Elegir para B</button>
        </div>
      `;
      panel.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar personajes:", error);
    const panel = document.getElementById("personajes");
    panel.innerHTML = '<p style="color: #ff8080;">Error al cargar personajes</p>';
  }
}

// ✅ 2. Seleccionar personajes
function seleccionar(equipo, id, nombre, button) {
  if (equipo === 'A') {
    if (personajeBId === id) {
      alert("Este personaje ya está seleccionado para el Jugador B");
      return;
    }
    personajeAId = id;
    document.getElementById("equipoA").innerHTML = `
      <div class="personaje-seleccionado">
        <strong>${nombre}</strong><br>
        <small>Seleccionado para Jugador A</small>
      </div>
    `;
  } else {
    if (personajeAId === id) {
      alert("Este personaje ya está seleccionado para el Jugador A");
      return;
    }
    personajeBId = id;
    document.getElementById("equipoB").innerHTML = `
      <div class="personaje-seleccionado">
        <strong>${nombre}</strong><br>
        <small>Seleccionado para Jugador B</small>
      </div>
    `;
  }

  // Estilo visual de selección
  document.querySelectorAll('.personaje button').forEach(btn => {
    btn.style.background = '#00cc66';
    btn.style.color = '#fff';
  });
  button.style.background = '#00ff88';
  button.style.color = '#000';
}

// ✅ 3. Crear batalla 1vs1 y redirigir al escenario
async function crearBatalla1vs1() {
  if (!personajeAId || !personajeBId) {
    alert("Debes elegir ambos personajes.");
    return;
  }

  try {
    const response = await fetch("https://apipelea.onrender.com/api/batallas/1vs1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        personajeA: personajeAId,
        personajeB: personajeBId,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      batallaIniciada = true;

      // ✅ Guardar datos para batallaVisual.html
      localStorage.setItem("batallaId", data._id || data.id || data.batalla?._id);
      localStorage.setItem("personajeA", personajeAId);
      localStorage.setItem("personajeB", personajeBId);

      // ✅ Redirigir al escenario de batalla visual
      window.location.href = "batallaVisual.html";
    } else {
      alert("Error: " + (data.message || data.mensaje));
    }
  } catch (error) {
    console.error("Error al iniciar la batalla", error);
    alert("Error de conexión con el servidor");
  }
}

// ✅ 4. Ejecutar turno 1vs1
async function ejecutarTurno1vs1() {
  if (!batallaIniciada) {
    alert("Debes iniciar una batalla primero.");
    return;
  }

  try {
    const response = await fetch(`https://apipelea.onrender.com/api/batallas/${batallaId}/turno`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await response.json();
    
    if (response.ok) {
      mostrarResultadoTurno(data);
    } else {
      alert("Error: " + (data.message || data.mensaje));
    }
  } catch (error) {
    console.error("Error al ejecutar turno:", error);
    alert("Error de conexión con el servidor");
  }
}

// ✅ 5. Mostrar resultado del turno
function mostrarResultadoTurno(data) {
  const resultadoDiv = document.getElementById("resultado");
  if (!resultadoDiv) return;

  resultadoDiv.innerHTML = `
    <h3>${data.mensaje || "Turno ejecutado"}</h3>
    <p>Atacante: ${data.atacante?.nombre || 'N/A'}</p>
    <p>Defensor: ${data.defensor?.nombre || 'N/A'}</p>
    <p>Daño: ${data.daño || 0}</p>
    <p>Vida restante: ${data.vidaRestante || 0}</p>
    ${data.ganador ? `<p><strong>🏆 ¡${data.ganador.nombre} ha ganado! 🏆</strong></p>` : ''}
  `;
}

// ✅ 6. Configurar event listeners
document.addEventListener('DOMContentLoaded', function() {
  const botonIniciar = document.getElementById('iniciarBatalla');
  const botonTurno = document.getElementById('ejecutarTurno');
  
  if (botonIniciar) {
    botonIniciar.addEventListener('click', crearBatalla1vs1);
  }
  
  if (botonTurno) {
    botonTurno.addEventListener('click', ejecutarTurno1vs1);
  }
  
  // Event listeners para botones de selección de personajes
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-seleccion')) {
      const equipo = e.target.dataset.equipo;
      const id = e.target.dataset.id;
      const nombre = e.target.dataset.nombre;
      seleccionar(equipo, id, nombre, e.target);
    }
  });
  
  // Inicializar
  cargarPersonajes();
});
