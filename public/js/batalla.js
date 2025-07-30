const personajesContainer = document.getElementById("gridPersonajes");
const confirmarBtn = document.getElementById("crearBatallaBtn");
const boxA = document.getElementById("boxA");
const boxB = document.getElementById("boxB");

let seleccionTeamA = [];
let seleccionTeamB = [];
let turno = "A"; // alternar selección entre equipos
let personajesData = []; // almacenar datos de personajes

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

    personajesContainer.innerHTML = ''; // Limpiar contenedor

    // Limitar a los primeros 10 personajes
    const personajesLimitados = personajesData.slice(0, 10);
    
    personajesLimitados.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("personaje");
      div.innerHTML = `
        <img src="${p.imagen || 'https://via.placeholder.com/80'}" alt="${p.nombre}" />
        <p>${p.nombre}</p>
        <small>HP: ${p.vida} | ATK: ${p.ataque} | DEF: ${p.defensa} | ESC: ${p.escudo || 0}</small>
      `;
      div.addEventListener("click", () => seleccionar(p._id, div, p));
      personajesContainer.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar personajes:", error);
    personajesContainer.innerHTML = '<p style="color: #ff8080;">Error al cargar personajes</p>';
  }
}

// ✅ 2. Seleccionar personajes
function seleccionar(id, div, personaje) {
  // Verificar si el personaje ya está seleccionado en el otro equipo
  const yaEnTeamA = seleccionTeamA.some(p => p.id === id);
  const yaEnTeamB = seleccionTeamB.some(p => p.id === id);
  
  if (turno === "A" && seleccionTeamA.length < 3) {
    if (yaEnTeamB) {
      alert("Este personaje ya está seleccionado en el Team B");
      return;
    }
    seleccionTeamA.push({ id, personaje });
    div.classList.add("team-a");
    mostrarPersonajeEnEquipo(boxA, personaje, seleccionTeamA.length);
    if (seleccionTeamA.length === 3) turno = "B";
  } else if (turno === "B" && seleccionTeamB.length < 3) {
    if (yaEnTeamA) {
      alert("Este personaje ya está seleccionado en el Team A");
      return;
    }
    seleccionTeamB.push({ id, personaje });
    div.classList.add("team-b");
    mostrarPersonajeEnEquipo(boxB, personaje, seleccionTeamB.length);
  }
}

// ✅ 3. Mostrar personaje en equipo
function mostrarPersonajeEnEquipo(container, personaje, posicion) {
  const div = document.createElement("div");
  div.classList.add("personaje-seleccionado");
  div.innerHTML = `
    <strong>${posicion}. ${personaje.nombre}</strong><br>
    <small>HP: ${personaje.vida} | ATK: ${personaje.ataque} | DEF: ${personaje.defensa} | ESC: ${personaje.escudo || 0}</small>
  `;
  container.appendChild(div);
}

// ✅ 4. Crear batalla
confirmarBtn.addEventListener("click", async () => {
  if (seleccionTeamA.length !== 3 || seleccionTeamB.length !== 3) {
    alert("Selecciona 3 personajes por equipo.");
    return;
  }

  const data = {
    teamA: seleccionTeamA.map(p => p.id),
    teamB: seleccionTeamB.map(p => p.id)
  };

  try {
    const response = await fetch("https://apipelea.onrender.com/api/batallas/3vs3/crear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
      alert("Batalla creada con éxito. ID: " + result._id);
      localStorage.setItem("batallaId", result._id);
      window.location.href = "ordenar.html"; // redirige a ordenar
    } else {
      alert("Error: " + (result.message || result.mensaje));
    }
  } catch (error) {
    console.error("Error al crear batalla:", error);
    alert("Error de conexión con el servidor");
  }
});

// ✅ 5. Inicializar
document.addEventListener('DOMContentLoaded', function() {
  cargarPersonajes();
});

