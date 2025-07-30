// ===== BATALLA VISUAL KOF - JAVASCRIPT =====

// ✅ Verificación de autenticación
if (!localStorage.getItem("token")) {
  alert("Necesitas iniciar sesión para acceder");
  window.location.href = "/login.html";
}

// Variables globales
let batallaId = localStorage.getItem("batallaId");
let personajeA = localStorage.getItem("personajeA");
let personajeB = localStorage.getItem("personajeB");
let token = localStorage.getItem("token");

// Estado del juego
let estadoJuego = {
  personajeActivo: 'A', // 'A' o 'B'
  personajes: {},
  batallaFinalizada: false,
  controlesActivos: true,
  posicionA: 0, // Posición del personaje A (-50 a 50)
  posicionB: 0, // Posición del personaje B (-50 a 50)
  teclasPresionadas: new Set(),
  turnoActual: 1
};

// Elementos del DOM
const elementos = {
  turnoActual: document.getElementById("turnoActual"),
  mensajeAtaque: document.getElementById("mensajeAtaque"),
  detallesAtaque: document.getElementById("detallesAtaque"),
  modalVictoria: document.getElementById("modalVictoria"),
  ganadorNombre: document.getElementById("ganadorNombre"),
  spriteA: document.getElementById("personajeA-sprite"),
  spriteB: document.getElementById("personajeB-sprite"),
  indicadorA: document.getElementById("indicadorA"),
  indicadorB: document.getElementById("indicadorB")
};

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🎮 Iniciando batalla visual KOF...');
  console.log('Batalla ID:', batallaId);
  console.log('Token:', token ? 'Presente' : 'Ausente');
  console.log('Personaje A:', personajeA);
  console.log('Personaje B:', personajeB);
  
  if (!batallaId || !token) {
    alert('❌ Error: Faltan datos de batalla. Regresa a la selección.');
    window.location.href = 'seleccion1vs1.html';
    return;
  }

  // Configurar event listeners para botones del modal
  const nuevaBatallaBtn = document.getElementById('nuevaBatallaBtn');
  const volverMenuBtn = document.getElementById('volverMenuBtn');
  
  if (nuevaBatallaBtn) {
    nuevaBatallaBtn.addEventListener('click', nuevaBatalla);
  }
  
  if (volverMenuBtn) {
    volverMenuBtn.addEventListener('click', volverMenu);
  }

  await inicializarBatalla();
  configurarControles();
  actualizarInterfaz();
});

// ===== INICIALIZACIÓN =====

async function inicializarBatalla() {
  try {
    console.log('📡 Cargando datos de personajes...');
    
    // Obtener datos de personajes
    const personajesResponse = await fetch("https://apipelea.onrender.com/api/personajes", {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!personajesResponse.ok) {
      throw new Error('Error al cargar personajes');
    }
    
    const personajes = await personajesResponse.json();
    
    // Encontrar personajes específicos
    const pA = personajes.find(p => p._id === personajeA);
    const pB = personajes.find(p => p._id === personajeB);
    
    if (!pA || !pB) {
      throw new Error('Personajes no encontrados');
    }
    
    // Guardar datos de personajes
    estadoJuego.personajes = {
      A: {
        id: pA._id,
        nombre: pA.nombre,
        vida: pA.vida,
        ataque: pA.ataque,
        defensa: pA.defensa || 0,
        escudo: pA.escudo || 0,
        imagen: pA.imagen || '🥷'
      },
      B: {
        id: pB._id,
        nombre: pB.nombre,
        vida: pB.vida,
        ataque: pB.ataque,
        defensa: pB.defensa || 0,
        escudo: pB.escudo || 0,
        imagen: pB.imagen || '👹'
      }
    };
    
    // Renderizar personajes
    renderizarPersonajes();
    
    console.log('✅ Batalla inicializada correctamente');
    
  } catch (error) {
    console.error('❌ Error al inicializar batalla:', error);
    alert('Error al cargar la batalla: ' + error.message);
  }
}

function renderizarPersonajes() {
  const pA = estadoJuego.personajes.A;
  const pB = estadoJuego.personajes.B;
  
  // Personaje A
  document.getElementById("nombreA").textContent = pA.nombre;
  document.getElementById("vidaA-valor").textContent = pA.vida;
  document.getElementById("ataqueA-valor").textContent = pA.ataque;
  document.getElementById("defensaA-valor").textContent = pA.defensa;
  document.getElementById("escudoA-valor").textContent = pA.escudo;
  document.getElementById("imagenA").textContent = pA.imagen;
  
  // Personaje B
  document.getElementById("nombreB").textContent = pB.nombre;
  document.getElementById("vidaB-valor").textContent = pB.vida;
  document.getElementById("ataqueB-valor").textContent = pB.ataque;
  document.getElementById("defensaB-valor").textContent = pB.defensa;
  document.getElementById("escudoB-valor").textContent = pB.escudo;
  document.getElementById("imagenB").textContent = pB.imagen;
  
  // Actualizar barras
  actualizarBarras();
  
  // Configurar mensaje inicial
  elementos.mensajeAtaque.textContent = `Turno de ${pA.nombre}. Presiona ESPACIO para atacar`;
  elementos.turnoActual.textContent = `Preparando batalla...`;
}

// ===== CONTROLES =====

function configurarControles() {
  // Teclas presionadas
  document.addEventListener('keydown', (e) => {
    if (!estadoJuego.controlesActivos || estadoJuego.batallaFinalizada) return;
    
    estadoJuego.teclasPresionadas.add(e.code);
    
    switch (e.code) {
      case 'KeyA':
      case 'KeyD':
        moverPersonaje(e.code);
        break;
      case 'Space':
        e.preventDefault();
        ejecutarAtaque();
        break;
    }
  });
  
  // Teclas liberadas
  document.addEventListener('keyup', (e) => {
    estadoJuego.teclasPresionadas.delete(e.code);
  });
  
  // Loop de movimiento
  setInterval(() => {
    if (estadoJuego.teclasPresionadas.has('KeyA') || estadoJuego.teclasPresionadas.has('KeyD')) {
      const tecla = estadoJuego.teclasPresionadas.has('KeyA') ? 'KeyA' : 'KeyD';
      moverPersonaje(tecla);
    }
  }, 100);
}

function moverPersonaje(tecla) {
  const personaje = estadoJuego.personajeActivo;
  const sprite = personaje === 'A' ? elementos.spriteA : elementos.spriteB;
  const posicion = personaje === 'A' ? estadoJuego.posicionA : estadoJuego.posicionB;
  
  let nuevaPosicion = posicion;
  
  if (tecla === 'KeyA') {
    nuevaPosicion = Math.max(-50, posicion - 2);
  } else if (tecla === 'KeyD') {
    nuevaPosicion = Math.min(50, posicion + 2);
  }
  
  // Aplicar movimiento
  if (personaje === 'A') {
    estadoJuego.posicionA = nuevaPosicion;
    sprite.style.transform = `translateX(${nuevaPosicion}px)`;
  } else {
    estadoJuego.posicionB = nuevaPosicion;
    sprite.style.transform = `translateX(${nuevaPosicion}px)`;
  }
  
  // Efecto de movimiento
  sprite.classList.add('moviendo');
  setTimeout(() => sprite.classList.remove('moviendo'), 300);
}

// ===== ATAQUES Y TURNOS =====

async function ejecutarAtaque() {
  if (estadoJuego.batallaFinalizada) {
    console.log('❌ Batalla ya finalizada');
    return;
  }
  
  const personaje = estadoJuego.personajeActivo;
  const sprite = personaje === 'A' ? elementos.spriteA : elementos.spriteB;
  
  // Efecto de ataque
  sprite.classList.add('atacando');
  elementos.mensajeAtaque.textContent = `${estadoJuego.personajes[personaje].nombre} está atacando...`;
  
  try {
    console.log(`⚔️ Ejecutando ataque de ${personaje}...`);
    console.log(`URL: https://apipelea.onrender.com/api/batallas/${batallaId}/turno`);
    
    const response = await fetch(`https://apipelea.onrender.com/api/batallas/${batallaId}/turno`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);

    if (!response.ok) {
      if (data.mensaje && data.mensaje.includes('finalizada')) {
        console.log('🏆 Batalla finalizada:', data.mensaje);
        if (data.ganador) {
          finalizarBatalla(data.ganador);
        }
        return;
      }
      throw new Error(data.mensaje || 'Error en el ataque');
    }

    // Procesar respuesta del ataque
    procesarResultadoAtaque(data);
    
  } catch (error) {
    console.error('❌ Error en ataque:', error);
    elementos.mensajeAtaque.textContent = `Error: ${error.message}`;
  } finally {
    // Remover efecto de ataque
    setTimeout(() => {
      sprite.classList.remove('atacando');
    }, 500);
  }
}

function procesarResultadoAtaque(data) {
  console.log('📊 Procesando resultado:', data);
  
  // Actualizar estado de personajes desde la respuesta del backend
  if (data.personajeA && data.personajeB) {
    estadoJuego.personajes.A.vida = data.personajeA.vida;
    estadoJuego.personajes.A.escudo = data.personajeA.escudo;
    estadoJuego.personajes.B.vida = data.personajeB.vida;
    estadoJuego.personajes.B.escudo = data.personajeB.escudo;
  }
  
  // Mostrar información del ataque
  mostrarInformacionAtaque(data);
  
  // Actualizar interfaz
  actualizarInterfaz();
  
  // Verificar si hay ganador
  if (data.ganador) {
    finalizarBatalla(data.ganador);
  } else {
    // Cambiar turno automáticamente
    cambiarTurno();
  }
}

function mostrarInformacionAtaque(data) {
  const turno = data.turno || estadoJuego.turnoActual;
  const atacante = data.atacante?.nombre || 'Desconocido';
  const defensor = data.defensor?.nombre || 'Desconocido';
  const daño = data.daño || 0;
  const vidaRestante = data.vidaRestante || 0;
  const escudoRestante = data.escudoRestante || 0;
  
  elementos.turnoActual.textContent = `Turno #${turno} → ${atacante} ataca`;
  
  const detalles = `
    ⚔️ Atacante: ${atacante}
    🛡️ Defensor: ${defensor}
    💥 Daño: ${daño}
    ❤️ Vida restante: ${vidaRestante}
    🛡️ Escudo restante: ${escudoRestante}
  `;
  
  elementos.detallesAtaque.textContent = detalles;
  
  // Efecto de partículas
  crearParticulas();
}

function cambiarTurno() {
  estadoJuego.personajeActivo = estadoJuego.personajeActivo === 'A' ? 'B' : 'A';
  estadoJuego.turnoActual++;
  actualizarIndicadoresTurno();
  
  const personaje = estadoJuego.personajes[estadoJuego.personajeActivo];
  elementos.mensajeAtaque.textContent = `Turno de ${personaje.nombre}. Presiona ESPACIO para atacar`;
  
  console.log(`🔄 Cambio de turno: ${estadoJuego.personajeActivo}`);
}

function actualizarIndicadoresTurno() {
  elementos.indicadorA.classList.toggle('activo', estadoJuego.personajeActivo === 'A');
  elementos.indicadorB.classList.toggle('activo', estadoJuego.personajeActivo === 'B');
}

// ===== INTERFAZ =====

function actualizarInterfaz() {
  const pA = estadoJuego.personajes.A;
  const pB = estadoJuego.personajes.B;
  
  // Actualizar valores
  document.getElementById("vidaA-valor").textContent = pA.vida;
  document.getElementById("ataqueA-valor").textContent = pA.ataque;
  document.getElementById("defensaA-valor").textContent = pA.defensa;
  document.getElementById("escudoA-valor").textContent = pA.escudo;
  
  document.getElementById("vidaB-valor").textContent = pB.vida;
  document.getElementById("ataqueB-valor").textContent = pB.ataque;
  document.getElementById("defensaB-valor").textContent = pB.defensa;
  document.getElementById("escudoB-valor").textContent = pB.escudo;
  
  // Actualizar barras
  actualizarBarras();
  
  // Actualizar indicadores de turno
  actualizarIndicadoresTurno();
}

function actualizarBarras() {
  const pA = estadoJuego.personajes.A;
  const pB = estadoJuego.personajes.B;
  
  // Barras de vida (asumiendo vida máxima de 100)
  const vidaAMax = 100;
  const vidaBMax = 100;
  
  document.getElementById("vidaA").style.width = `${Math.max(0, (pA.vida / vidaAMax) * 100)}%`;
  document.getElementById("vidaB").style.width = `${Math.max(0, (pB.vida / vidaBMax) * 100)}%`;
  
  // Barras de escudo (asumiendo escudo máximo de 50)
  const escudoMax = 50;
  
  document.getElementById("escudoA").style.width = `${Math.max(0, (pA.escudo / escudoMax) * 100)}%`;
  document.getElementById("escudoB").style.width = `${Math.max(0, (pB.escudo / escudoMax) * 100)}%`;
  
  // Efectos visuales cuando la vida es baja
  const barraVidaA = document.getElementById("vidaA");
  const barraVidaB = document.getElementById("vidaB");
  
  if (pA.vida <= 20) {
    barraVidaA.style.background = 'linear-gradient(90deg, #ff0040, #ff6b35)';
  }
  
  if (pB.vida <= 20) {
    barraVidaB.style.background = 'linear-gradient(90deg, #ff0040, #ff6b35)';
  }
}

// ===== FINALIZACIÓN =====

function finalizarBatalla(ganador) {
  console.log('🏆 Finalizando batalla. Ganador:', ganador);
  
  estadoJuego.batallaFinalizada = true;
  estadoJuego.controlesActivos = false;
  
  // Mostrar modal de victoria
  elementos.ganadorNombre.textContent = ganador;
  elementos.modalVictoria.classList.add('mostrar');
  
  // Efectos de victoria
  crearEfectosVictoria();
}

function crearEfectosVictoria() {
  // Crear partículas de victoria
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      crearParticula('✨', 'victoria');
    }, i * 100);
  }
}

// ===== EFECTOS VISUALES =====

function crearParticulas() {
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      crearParticula('⚡', 'ataque');
    }, i * 50);
  }
}

function crearParticula(simbolo, tipo) {
  const particula = document.createElement('div');
  particula.textContent = simbolo;
  particula.style.cssText = `
    position: absolute;
    font-size: 1.5rem;
    pointer-events: none;
    z-index: 1000;
    animation: particula 1s ease-out forwards;
  `;
  
  // Posición aleatoria
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  particula.style.left = x + 'px';
  particula.style.top = y + 'px';
  
  // Color según tipo
  if (tipo === 'ataque') {
    particula.style.color = '#ff6b35';
    particula.style.textShadow = '0 0 10px #ff6b35';
  } else if (tipo === 'victoria') {
    particula.style.color = '#ffff00';
    particula.style.textShadow = '0 0 15px #ffff00';
  }
  
  document.getElementById('particulas').appendChild(particula);
  
  // Remover después de la animación
  setTimeout(() => {
    particula.remove();
  }, 1000);
}

// ===== FUNCIONES DE NAVEGACIÓN =====

function nuevaBatalla() {
  localStorage.removeItem("batallaId");
  localStorage.removeItem("personajeA");
  localStorage.removeItem("personajeB");
  window.location.href = "seleccion1vs1.html";
}

function volverMenu() {
  localStorage.removeItem("batallaId");
  localStorage.removeItem("personajeA");
  localStorage.removeItem("personajeB");
  window.location.href = "modo.html";
}

// ===== ANIMACIONES CSS ADICIONALES =====

// Agregar estilos de animación para partículas
const estilosAnimacion = document.createElement('style');
estilosAnimacion.textContent = `
  @keyframes particula {
    0% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
    100% {
      opacity: 0;
      transform: scale(0.5) translateY(-50px);
    }
  }
`;
document.head.appendChild(estilosAnimacion);

console.log('🎮 Sistema de batalla visual KOF cargado correctamente');
