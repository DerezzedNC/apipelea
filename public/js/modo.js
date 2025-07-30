// ===== MODO.JS - NAVEGACIÓN ENTRE MODOS DE BATALLA =====

console.log('🎮 Modo.js iniciando carga...');

document.addEventListener('DOMContentLoaded', function() {
  console.log('🎮 Modo.js cargado correctamente');
  console.log('🔍 Buscando botones...');
  
  // Event listener para modo 1vs1
  const boton1vs1 = document.getElementById('modo1vs1');
  console.log('Botón 1vs1 encontrado:', boton1vs1);
  
  if (boton1vs1) {
    boton1vs1.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('🗡️ Redirigiendo a batalla 1vs1...');
      window.location.href = '/batalla1vs1.html';
    });
    console.log('✅ Event listener agregado para modo 1vs1');
  } else {
    console.warn('⚠️ Botón modo1vs1 no encontrado');
  }
  
  // Event listener para modo 3vs3
  const boton3vs3 = document.getElementById('modo3vs3');
  console.log('Botón 3vs3 encontrado:', boton3vs3);
  
  if (boton3vs3) {
    boton3vs3.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('⚔️ Redirigiendo a batalla 3vs3...');
      window.location.href = '/batalla3vs3.html';
    });
    console.log('✅ Event listener agregado para modo 3vs3');
  } else {
    console.warn('⚠️ Botón modo3vs3 no encontrado');
  }
  
  console.log('✅ Todos los event listeners configurados');
});

console.log('✅ Script de navegación de modos cargado'); 