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

// ✅ 4. Inicializar
cargarPersonajes();
