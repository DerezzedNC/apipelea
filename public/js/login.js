document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const mensajeError = document.getElementById("mensaje-error");
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const nombre = document.getElementById("nombre").value;
      const password = document.getElementById("password").value;
  
      try {
        const response = await fetch("https://apipelea.onrender.com/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ nombre, password })
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Guardar token y redirigir
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.userId);
          window.location.href = "batalla.html"; // redirige a selección
        } else {
          mensajeError.textContent = data.mensaje || "Credenciales incorrectas";
          mensajeError.style.display = "block";
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        mensajeError.textContent = "⚠️ Error de conexión con el servidor";
        mensajeError.style.display = "block";
      }
    });
  });
  