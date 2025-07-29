document.addEventListener("DOMContentLoaded", () => {
    const boxA = document.getElementById("ordenBoxA");
    const boxB = document.getElementById("ordenBoxB");
    const confirmarBtn = document.getElementById("confirmarOrden");
  
    // Obtener personajes de localStorage
    const teamA = JSON.parse(localStorage.getItem("teamA")) || [];
    const teamB = JSON.parse(localStorage.getItem("teamB")) || [];
    const batallaId = localStorage.getItem("batallaId");
    const token = localStorage.getItem("token");
  
    let ordenA = [];
    let ordenB = [];
  
    const crearCajaOrden = (team, box, ordenArray) => {
      team.forEach((personaje, index) => {
        const div = document.createElement("div");
        div.className = "personaje";
        div.textContent = personaje.nombre;
        div.dataset.id = personaje._id;
  
        div.addEventListener("click", () => {
          if (!ordenArray.includes(personaje._id)) {
            ordenArray.push(personaje._id);
            div.classList.add("seleccionado");
          } else {
            ordenArray = ordenArray.filter(id => id !== personaje._id);
            div.classList.remove("seleccionado");
          }
        });
  
        box.appendChild(div);
      });
    };
  
    crearCajaOrden(teamA, boxA, ordenA);
    crearCajaOrden(teamB, boxB, ordenB);
  
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
  
        if (!response.ok) {
          throw new Error("Error al confirmar el orden.");
        }
  
        alert("¡Orden establecido! Ahora puedes comenzar las rondas.");
        // Aquí puedes redirigir a round1.html, por ejemplo
        window.location.href = "round1.html";
      } catch (error) {
        console.error(error);
        alert("Error al enviar el orden de combate.");
      }
    });
  });
  