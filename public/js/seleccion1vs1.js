const panelPersonajes = document.getElementById("panel-personajes");
const teamABox = document.getElementById("teamA");
const teamBBox = document.getElementById("teamB");
const crearBatallaBtn = document.getElementById("crearBatallaBtn");

let teamA = null;
let teamB = null;

async function cargarPersonajes() {
  try {
    const res = await fetch("https://apipelea.onrender.com/api/personajes", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    const personajes = await res.json();

    panelPersonajes.innerHTML = "";

    personajes.slice(0, 10).forEach(p => {
      const card = document.createElement("div");
      card.classList.add("personaje");
      card.innerHTML = `
        <img src="${p.imagen || 'https://via.placeholder.com/80'}" alt="${p.nombre}" />
        <p>${p.nombre}</p>
        <small>HP: ${p.vida} | ATK: ${p.ataque} | DEF: ${p.defensa} | ESC: ${p.escudo || 0}</small>
      `;
      card.addEventListener("click", () => seleccionarPersonaje(p, card));
      panelPersonajes.appendChild(card);
    });
  } catch (err) {
    console.error("Error al cargar personajes", err);
    panelPersonajes.innerHTML = "<p>Error al cargar personajes.</p>";
  }
}

function seleccionarPersonaje(personaje, div) {
  // Ya seleccionado en algún equipo
  if (teamA?.id === personaje._id || teamB?.id === personaje._id) return;

  if (!teamA) {
    teamA = { id: personaje._id, nombre: personaje.nombre };
    div.classList.add("team-a");
    teamABox.innerHTML = `<strong>${personaje.nombre}</strong>`;
  } else if (!teamB) {
    teamB = { id: personaje._id, nombre: personaje.nombre };
    div.classList.add("team-b");
    teamBBox.innerHTML = `<strong>${personaje.nombre}</strong>`;
  }
}

crearBatallaBtn.addEventListener("click", async () => {
  if (!teamA || !teamB) {
    return alert("Selecciona un personaje para cada equipo.");
  }

  try {
    const res = await fetch("https://apipelea.onrender.com/api/batallas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        personajeA: teamA.id,
        personajeB: teamB.id
      })
    });

    const result = await res.json();

    if (res.ok) {
      localStorage.setItem("batallaId", result._id || result.id);
      window.location.href = "batallaVisual.html";
    } else {
      alert(result.mensaje || result.message || "Error al crear batalla");
    }
  } catch (error) {
    console.error("Error al crear batalla", error);
    alert("Error de conexión con el servidor");
  }
});

cargarPersonajes();
