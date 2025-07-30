// ===== REGISTRO.JS - REGISTRO DE USUARIOS =====

async function registrar() {
  const nombre = document.getElementById('nombre').value;
  const password = document.getElementById('password').value;
  const rol = document.getElementById('rol').value;

  if (!nombre || !password || !rol) {
    alert("Completa todos los campos");
    return;
  }

  try {
    const response = await fetch('https://apipelea.onrender.com/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, password, rol })
    });

    const data = await response.json();

    if (response.ok) {
      alert("Usuario registrado correctamente");
      window.location.href = "/login.html";
    } else {
      alert(data.mensaje || "Error al registrar usuario");
    }
  } catch (error) {
    alert("Error al conectar con el servidor");
    console.error(error);
  }
}

console.log('✅ Script de registro cargado'); 