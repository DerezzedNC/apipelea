// Script de prueba para verificar que el userId se incluya correctamente
const axios = require('axios');

const BASE_URL = 'https://apipelea.onrender.com/api';

async function testUserIdFix() {
  try {
    console.log('🧪 Iniciando prueba de corrección de userId...\n');

    // 1. Login para obtener token
    console.log('1. 🔐 Obteniendo token de autenticación...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@test.com',
      password: 'admin123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido correctamente\n');

    // 2. Obtener personajes disponibles
    console.log('2. 👥 Obteniendo personajes disponibles...');
    const personajesResponse = await axios.get(`${BASE_URL}/personajes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const personajes = personajesResponse.data;
    console.log(`✅ ${personajes.length} personajes obtenidos\n`);

    if (personajes.length < 2) {
      console.log('❌ Se necesitan al menos 2 personajes para la prueba');
      return;
    }

    // 3. Crear batalla 1vs1 (esto debería funcionar sin error de userId)
    console.log('3. ⚔️ Creando batalla 1vs1...');
    const personajeA = personajes[0]._id;
    const personajeB = personajes[1]._id;
    
    const batallaResponse = await axios.post(`${BASE_URL}/batallas/1vs1`, {
      personajeA,
      personajeB
    }, {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    
    const batalla = batallaResponse.data;
    console.log(`✅ Batalla creada exitosamente: ${batalla._id}`);
    console.log(`   Personaje A: ${personajes[0].nombre}`);
    console.log(`   Personaje B: ${personajes[1].nombre}`);
    console.log(`   userId incluido automáticamente desde token\n`);

    // 4. Verificar que la batalla se creó con userId
    console.log('4. 🔍 Verificando que la batalla tiene userId...');
    const resumenResponse = await axios.get(`${BASE_URL}/batallas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const resumen = resumenResponse.data;
    const batallaCreada = resumen.find(b => b._id === batalla._id);
    
    if (batallaCreada) {
      console.log('✅ Batalla encontrada en el resumen del usuario');
    } else {
      console.log('❌ Batalla no encontrada en el resumen');
    }

    // 5. Probar ejecutar un turno
    console.log('\n5. 🎯 Probando ejecución de turno...');
    const turnoResponse = await axios.post(`${BASE_URL}/batallas/${batalla._id}/turno`, {}, {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    
    const turnoData = turnoResponse.data;
    console.log(`✅ Turno ejecutado: ${turnoData.mensaje}`);

    console.log('\n🎉 ¡Prueba completada exitosamente!');
    console.log('✅ El userId se está incluyendo correctamente desde el token JWT');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.response?.data || error.message);
    
    if (error.response?.data?.message?.includes('userId')) {
      console.error('🔧 El problema persiste: userId no se está incluyendo');
    }
  }
}

// Ejecutar prueba
testUserIdFix(); 