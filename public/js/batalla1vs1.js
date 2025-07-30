let personajeAId = null;
let personajeBId = null;
let batallaIniciada = false;
let personajesData = [];

// ✅ 1. Cargar personajes desde la API
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

    const panel = document.getElementById("personajes");
    panel.innerHTML = ''; // Limpiar contenedor

    // Limitar a los primeros 10 personajes
    const personajesLimitados = personajesData.slice(0, 10);
    
    personajesLimitados.forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("personaje");
      div.innerHTML = `
        <img src="${p.imagen || 'https://via.placeholder.com/80'}" alt="${p.nombre}" />
        <p>${p.nombre}</p>
        <small>HP: ${p.vida} | ATK: ${p.ataque} | DEF: ${p.defensa} | ESC: ${p.escudo || 0}</small>
        <div class="botones-seleccion">
          <button onclick="seleccionar('A', '${p._id}', '${p.nombre}', this)">Elegir para A</button>
          <button onclick="seleccionar('B', '${p._id}', '${p.nombre}', this)">Elegir para B</button>
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

// ✅ 2. Selección de personajes
function seleccionar(equipo, id, nombre, button) {
  // Verificar si el personaje ya está seleccionado en el otro equipo
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
    // Limpiar selección anterior
    document.querySelectorAll('.personaje button').forEach(btn => {
      btn.style.background = '#00cc66';
    });
    button.style.background = '#00ff88';
    button.style.color = '#000';
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
    // Limpiar selección anterior
    document.querySelectorAll('.personaje button').forEach(btn => {
      btn.style.background = '#00cc66';
    });
    button.style.background = '#00ff88';
    button.style.color = '#000';
  }
}

// ✅ 3. Crear batalla 1vs1
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
      mostrarResultado(data);
    } else {
      alert("Error: " + (data.message || data.mensaje));
    }
  } catch (error) {
    console.error("Error al iniciar la batalla", error);
    alert("Error de conexión con el servidor");
  }
}

// ✅ 4. Ejecutar siguiente turno
async function ejecutarTurno1vs1() {
  if (!batallaIniciada) {
    alert("Primero debes iniciar la batalla.");
    return;
  }

  try {
    const response = await fetch("https://apipelea.onrender.com/api/batallas/1vs1/turno", {
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
      mostrarResultado(data);
    } else {
      alert("Error: " + (data.message || data.mensaje));
    }
  } catch (error) {
    console.error("Error al ejecutar turno", error);
    alert("Error de conexión con el servidor");
  }
}

// ✅ 5. Mostrar resultado de cada turno
function mostrarResultado(data) {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = `
    <h3 style="color: #ffaa00;">${data.mensaje || "Turno ejecutado"}</h3>
    <div style="display: flex; justify-content: space-around; margin: 20px 0;">
      <div style="background: #004422; padding: 15px; border-radius: 10px; border: 2px solid #00ff88;">
        <strong style="color: #00ff88;">${data.personajeA?.nombre || 'Jugador A'}</strong><br>
        <small>Vida: ${data.personajeA?.vida || 0} | Defensa: ${data.personajeA?.defensa || 0} | Escudo: ${data.personajeA?.escudo || 0}</small>
      </div>
      <div style="background: #442200; padding: 15px; border-radius: 10px; border: 2px solid #ffaa00;">
        <strong style="color: #ffaa00;">${data.personajeB?.nombre || 'Jugador B'}</strong><br>
        <small>Vida: ${data.personajeB?.vida || 0} | Defensa: ${data.personajeB?.defensa || 0} | Escudo: ${data.personajeB?.escudo || 0}</small>
      </div>
    </div>
    <p style="text-align: center; color: #ffcc00;"><em>Turno actual: ${data.turno || 'N/A'}</em></p>
  `;
}

// ✅ 6. Inicializar
cargarPersonajes();
