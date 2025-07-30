document.addEventListener("DOMContentLoaded", () => {
    const boxA = document.getElementById("ordenBoxA");
    const boxB = document.getElementById("ordenBoxB");
    const confirmarBtn = document.getElementById("confirmarOrden");
  
    // Obtener batallaId del localStorage
    const batallaId = localStorage.getItem("batallaId");
    const token = localStorage.getItem("token");
  
    let ordenA = [];
    let ordenB = [];
    let personajesData = [];
  
    // ✅ 1. Cargar datos de la batalla
    async function cargarDatosBatalla() {
      try {
        const response = await fetch(`https://apipelea.onrender.com/api/batallas/3vs3/${batallaId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          throw new Error("Error al cargar datos de la batalla");
        }
  
        const batalla = await response.json();
        console.log("Datos de batalla:", batalla);
  
        // Cargar personajes
        const personajesResponse = await fetch("https://apipelea.onrender.com/api/personajes", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        if (!personajesResponse.ok) {
          throw new Error("Error al cargar personajes");
        }
  
        personajesData = await personajesResponse.json();
  
        // Crear cajas de orden
        crearCajaOrden(batalla.teamA, boxA, ordenA, "A");
        crearCajaOrden(batalla.teamB, boxB, ordenB, "B");
  
      } catch (error) {
        console.error("Error:", error);
        alert("Error al cargar datos de la batalla");
      }
    }
  
    // ✅ 2. Crear caja de orden
    const crearCajaOrden = (teamIds, box, ordenArray, equipo) => {
      box.innerHTML = ''; // Limpiar contenedor
  
      teamIds.forEach((personajeId, index) => {
        const personaje = personajesData.find(p => p._id === personajeId);
        if (!personaje) return;
  
        const div = document.createElement("div");
        div.className = "personaje-seleccionado";
        div.innerHTML = `
          <strong>${personaje.nombre}</strong><br>
          <small>HP: ${personaje.vida} | ATK: ${personaje.ataque} | DEF: ${personaje.defensa} | ESC: ${personaje.escudo || 0}</small>
        `;
        div.dataset.id = personajeId;
        div.dataset.index = index;
  
        div.addEventListener("click", () => {
          if (!ordenArray.includes(personajeId)) {
            ordenArray.push(personajeId);
            div.classList.add("seleccionado");
            div.style.background = "#003a2f";
            div.style.borderColor = "#ffaa00";
          } else {
            ordenArray = ordenArray.filter(id => id !== personajeId);
            div.classList.remove("seleccionado");
            div.style.background = "#003a2f";
            div.style.borderColor = "#00ff88";
          }
        });
  
        box.appendChild(div);
      });
    };
  
    // ✅ 3. Confirmar orden
    confirmarBtn.addEventListener("click", async () => {
      if (ordenA.length !== 3 || ordenB.length !== 3) {
        alert("Debes seleccionar 3 personajes en orden para cada equipo.");
        return;
      }
  
      try {
        const response = await fetch(`https://apipelea.onrender.com/api/batallas/3vs3/${batallaId}/ordenar`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            ordenRondas: [
              { a: ordenA[0], b: ordenB[0] },
              { a: ordenA[1], b: ordenB[1] },
              { a: ordenA[2], b: ordenB[2] }
            ]
          })
        });
  
        const data = await response.json();
        if (response.ok) {
          alert("¡Orden establecido! Ahora puedes comenzar las rondas.");
          // Redirigir a la página de batalla 3vs3
          window.location.href = "batalla3vs3.html";
        } else {
          alert("Error: " + (data.message || data.mensaje));
        }
      } catch (error) {
        console.error(error);
        alert("Error al enviar el orden de combate.");
      }
    });
  
    // ✅ 4. Inicializar
    cargarDatosBatalla();
  });
  