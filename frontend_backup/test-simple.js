// Script de prueba simple para verificar conexión
const axios = require('axios');

async function testConnection() {
  try {
    console.log('🔍 Probando conexión al servidor de Render...');
    
    // Probar conexión básica
    const response = await axios.get('https://apipelea.onrender.com/api/personajes', {
      headers: { 
        Authorization: 'Bearer test-token' 
      },
      timeout: 10000
    });
    
    console.log('✅ Servidor de Render respondiendo correctamente');
    console.log('Status:', response.status);
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔧 El servidor no está respondiendo');
    } else if (error.response) {
      console.error('🔧 Servidor respondió con error:', error.response.status);
      console.error('Mensaje:', error.response.data?.mensaje || 'Sin mensaje');
    }
  }
}

testConnection(); 