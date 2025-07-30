// ===== LOGIN.JS - AUTENTICACIÓN DE USUARIOS =====

document.addEventListener('DOMContentLoaded', function() {
  const loginBtn = document.getElementById('loginBtn');
  
  if (loginBtn) {
    loginBtn.addEventListener('click', login);
  }
});

async function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert("Completa ambos campos");
    return;
  }

  try {
    const response = await fetch('https://apipelea.onrender.com/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre: username, password: password })
    });

    const data = await response.json();

    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      alert("Inicio de sesión exitoso");
      window.location.href = "/modo.html";
    } else {
      alert("Credenciales inválidas");
    }
  } catch (error) {
    alert("Error al conectar con el servidor");
    console.error(error);
  }
}

console.log('✅ Script de login cargado');
  