let personajeAId = null;
let personajeBId = null;
let batallaIniciada = false;

// Obtener los personajes disponibles
fetch("/api/personajes", {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
})
  .then((res) => res.json())
  .then((personajes) => {
    const panel = document.getElementById("personajes");

    personajes.forEach((p) => {
      const div = document.createElement("div");
      div.classList.add("personaje-card");
      div.innerHTML = `
        <h3>${p.nombre}</h3>
        <p>Vida: ${p.vida}</p>
        <p>Escudo: ${p.escudo}</p>
        <p>Ataque: ${p.ataque}</p>
        <button onclick="seleccionar('A', '${p._id}', '${p.nombre}')">Elegir para A</button>
        <button onclick="seleccionar('B', '${p._id}', '${p.nombre}')">Elegir para B</button>
      `;
      panel.appendChild(div);
    });
  });

// Selección de personajes
function seleccionar(equipo, id, nombre) {
  if (equipo === 'A') {
    personajeAId = id;
    document.getElementById("equipoA").textContent = nombre;
  } else {
    personajeBId = id;
    document.getElementById("equipoB").textContent = nombre;
  }
}

// Crear batalla 1vs1
function crearBatalla1vs1() {
  if (!personajeAId || !personajeBId) {
    alert("Debes elegir ambos personajes.");
    return;
  }

  fetch("/api/batallas/1vs1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({
      personajeA: personajeAId,
      personajeB: personajeBId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      batallaIniciada = true;
      mostrarResultado(data);
    })
    .catch((err) => {
      console.error("Error al iniciar la batalla", err);
    });
}

// Ejecutar siguiente turno
function ejecutarTurno1vs1() {
  if (!batallaIniciada) {
    alert("Primero debes iniciar la batalla.");
    return;
  }

  fetch("/api/batallas/1vs1", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({
      personajeA: personajeAId,
      personajeB: personajeBId,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      mostrarResultado(data);
    })
    .catch((err) => {
      console.error("Error al ejecutar turno", err);
    });
}

// Mostrar resultado de cada turno
function mostrarResultado(data) {
  const resultadoDiv = document.getElementById("resultado");
  resultadoDiv.innerHTML = `
    <h3>${data.mensaje || "Turno ejecutado"}</h3>
    <p><strong>${data.personajeA.nombre}</strong> - Vida: ${data.personajeA.vida}, Escudo: ${data.personajeA.escudo}</p>
    <p><strong>${data.personajeB.nombre}</strong> - Vida: ${data.personajeB.vida}, Escudo: ${data.personajeB.escudo}</p>
    <p><em>Turno actual: ${data.turno}</em></p>
  `;
}
