// ===== INDEX.JS - LOGIN PRINCIPAL =====

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById("loginForm");
  const mensaje = document.getElementById("mensaje");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("https://apipelea.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        mensaje.style.color = "#00ff88";
        mensaje.innerText = `🎮 Bienvenido ${data.usuario.nombre} [${data.usuario.rol.toUpperCase()}]`;

        setTimeout(() => {
          window.location.href = "/modo.html";
        }, 1500);
      } else {
        mensaje.style.color = "#ff8080";
        mensaje.innerText = "⚠️ Usuario o contraseña incorrectos";
      }
    } catch (err) {
      mensaje.style.color = "#ff8080";
      mensaje.innerText = "💥 Error de conexión con el servidor";
    }
  });
});

console.log('✅ Script de index cargado'); 