// ===== MODO.JS - NAVEGACIÓN ENTRE MODOS DE BATALLA =====

// ✅ Redirigir al login si no hay token
if (!localStorage.getItem("token")) {
  console.warn("❌ No hay token en localStorage. Redirigiendo al login...");
  window.location.href = "/login.html";
}

document.addEventListener('DOMContentLoaded', function () {
  console.log('🎮 Modo.js cargado correctamente');

  const boton1vs1 = document.getElementById('modo1vs1');
  const boton3vs3 = document.getElementById('modo3vs3');

  if (boton1vs1) {
    boton1vs1.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('🗡️ Redirigiendo a batalla 1vs1...');
      window.location.href = '/batalla1vs1.html';
    });
  }

  if (boton3vs3) {
    boton3vs3.addEventListener('click', function (e) {
      e.preventDefault();
      console.log('⚔️ Redirigiendo a batalla 3vs3...');
      window.location.href = '/batalla3vs3.html';
    });
  }
});
