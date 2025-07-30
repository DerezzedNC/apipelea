document.getElementById("form-login").addEventListener("submit", async function(e) {
    e.preventDefault();
  
    const usuario = document.getElementById("usuario").value;
    const contrasena = document.getElementById("password").value;
  
    try {
      const response = await fetch("https://apipelea.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nombre: usuario,
          password: contrasena
        })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("token", data.token);
        // Redirige al menú de modos
        window.location.href = "modo.html";
      } else {
        mostrarError("⚠️ " + (data.mensaje || "Credenciales incorrectas"));
      }
    } catch (error) {
      mostrarError("❇ Error de conexión con el servidor");
      console.error("ERROR:", error);
    }
  });
  
  function mostrarError(mensaje) {
    const contenedor = document.getElementById("mensaje-error");
    contenedor.textContent = mensaje;
    contenedor.style.display = "block";
  }
  