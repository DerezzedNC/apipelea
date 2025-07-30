let batallaId = localStorage.getItem("batallaId");
let personajeA = localStorage.getItem("personajeA");
let personajeB = localStorage.getItem("personajeB");
let turnoActual = 1;

// Permitir uso de espacio para ejecutar turno
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    ejecutarTurno();
  }
});

async function ejecutarTurno() {
  if (!batallaId) {
    return alert("Faltan datos para ejecutar la batalla");
  }

  try {
    // ✅ Usar el endpoint correcto para ejecutar turnos
    const response = await fetch(`https://apipelea.onrender.com/api/batallas/${batallaId}/turno`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Error del servidor:", data);
      
      // ✅ Manejar diferentes tipos de errores
      if (data.mensaje && data.mensaje.includes("finalizada")) {
        alert(`🏆 ${data.mensaje}`);
        return;
      }
      
      return alert("Error: " + (data.mensaje || data.message || "Error interno"));
    }

    // ✅ Mostrar turno actual
    document.getElementById("turnoActual").textContent = `Turno #${data.turno} → Ataca: ${data.atacante.nombre}`;

    // ✅ Actualizar barras de vida
    actualizarVida("vidaA", data.personajeA.vida);
    actualizarVida("vidaB", data.personajeB.vida);

    // ✅ Mostrar mensaje si hay ganador
    if (data.ganador) {
      alert(`🏆 ¡Ganador: ${data.ganador}!`);
    }

  } catch (err) {
    console.error(err);
    alert("Error al ejecutar el turno");
  }
}

function actualizarVida(barraId, vida) {
  const barra = document.getElementById(barraId);
  if (barra) {
    barra.style.width = `${Math.max(0, vida)}%`;
  }
}
