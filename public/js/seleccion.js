function elegirModo(modo) {
    if (modo === '1vs1') {
      window.location.href = 'batalla1vs1.html'; // Página de batalla individual
    } else if (modo === '3vs3') {
      window.location.href = 'seleccion.html'; // Página de selección de personajes 3vs3
    }
  }
  