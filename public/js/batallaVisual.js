let batallaId = localStorage.getItem("batallaId"); // Usa localStorage desde batalla anterior
let turnoActual = 1;

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    ejecutarTurno();
  }
});

async function ejecutarTurno() {
  if (!batallaId) return alert("No hay batalla activa");

  try {
    const response = await fetch(`https://apipelea.onrender.com/api/batallas/${batallaId}/turno`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      
    const data = await response.json();

    document.getElementById("turnoActual").textContent = `Turno #${data.turno} → Ataca: ${data.atacante.nombre}`;

    // Actualiza vida visual
    actualizarVida("vidaA", data.personajeA.vida);
    actualizarVida("vidaB", data.personajeB.vida);

    // Mostrar ganador
    if (data.ganador) {
      alert(`¡Ganador: ${data.ganador}!`);
    }

  } catch (err) {
    console.error(err);
    alert("Error al ejecutar el turno");
  }
}

function actualizarVida(barraId, vida) {
  const barra = document.getElementById(barraId);
  barra.style.width = `${vida}%`;
}
