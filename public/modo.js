// ===== MODO.JS - NAVEGACIÓN ENTRE MODOS DE BATALLA =====

document.addEventListener('DOMContentLoaded', function() {
  console.log('🎮 Modo.js cargado correctamente');
  
  // Event listener para modo 1vs1
  const boton1vs1 = document.getElementById('modo1vs1');
  if (boton1vs1) {
    boton1vs1.addEventListener('click', function() {
      console.log('🗡️ Redirigiendo a batalla 1vs1...');
      window.location.href = '/batalla1vs1.html';
    });
  } else {
    console.warn('⚠️ Botón modo1vs1 no encontrado');
  }
  
  // Event listener para modo 3vs3
  const boton3vs3 = document.getElementById('modo3vs3');
  if (boton3vs3) {
    boton3vs3.addEventListener('click', function() {
      console.log('⚔️ Redirigiendo a batalla 3vs3...');
      window.location.href = '/batalla3vs3.html';
    });
  } else {
    console.warn('⚠️ Botón modo3vs3 no encontrado');
  }
});

console.log('✅ Script de navegación de modos cargado'); 