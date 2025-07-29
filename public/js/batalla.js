const personajesContainer = document.getElementById("personajes");
const seleccionarBtn = document.getElementById("crear-batalla");

let seleccionTeamA = [];
let seleccionTeamB = [];
let turno = "A"; // alternar selección entre equipos

// ✅ 1. Cargar personajes desde la API
async function cargarPersonajes() {
  try {
    const response = await fetch("/api/personajes", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const personajes = await response.json();

    personajes.forEach(p => {
      const div = document.createElement("div");
      div.classList.add("personaje");
      div.innerHTML = `
        <img src="${p.imagen || 'https://via.placeholder.com/80'}" alt="${p.nombre}" />
        <p>${p.nombre}</p>
        <small>HP: ${p.vida}</small>
      `;
      div.addEventListener("click", () => seleccionar(p._id, div));
      personajesContainer.appendChild(div);
    });
  } catch (error) {
    console.error("Error al cargar personajes:", error);
  }
}

// ✅ 2. Seleccionar personajes
function seleccionar(id, div) {
  if (turno === "A" && seleccionTeamA.length < 3) {
    seleccionTeamA.push(id);
    div.classList.add("team-a");
    if (seleccionTeamA.length === 3) turno = "B";
  } else if (turno === "B" && seleccionTeamB.length < 3) {
    seleccionTeamB.push(id);
    div.classList.add("team-b");
  }
}

// ✅ 3. Crear batalla
seleccionarBtn.addEventListener("click", async () => {
  if (seleccionTeamA.length !== 3 || seleccionTeamB.length !== 3) {
    alert("Selecciona 3 personajes por equipo.");
    return;
  }

  const data = {
    teamA: seleccionTeamA,
    teamB: seleccionTeamB
  };

  try {
    const response = await fetch("/api/batallas/3vs3/crear", {
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
      window.location.href = "/panel.html"; // redirige al panel
    } else {
      alert("Error: " + result.message);
    }
  } catch (error) {
    console.error("Error al crear batalla:", error);
  }
});

cargarPersonajes();
