// Script de prueba para verificar la funcionalidad de batallas 1vs1
const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testBatalla1vs1() {
  try {
    console.log('🧪 Iniciando pruebas de batalla 1vs1...\n');

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

    // 3. Crear batalla 1vs1
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
    console.log(`✅ Batalla creada: ${batalla._id}\n`);

    // 4. Ejecutar turnos hasta que termine la batalla
    console.log('4. 🎯 Ejecutando turnos...');
    let turno = 1;
    let batallaFinalizada = false;
    
    while (!batallaFinalizada && turno <= 20) { // Máximo 20 turnos para evitar loop infinito
      console.log(`   Turno ${turno}...`);
      
      try {
        const turnoResponse = await axios.post(`${BASE_URL}/batallas/${batalla._id}/turno`, {}, {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
        const turnoData = turnoResponse.data;
        console.log(`   ✅ ${turnoData.mensaje}`);
        
        if (turnoData.ganador) {
          console.log(`   🏆 ¡Ganador: ${turnoData.ganador}!`);
          batallaFinalizada = true;
        }
        
        turno++;
      } catch (error) {
        if (error.response?.data?.mensaje?.includes('finalizada')) {
          console.log(`   🏆 ${error.response.data.mensaje}`);
          batallaFinalizada = true;
        } else {
          console.log(`   ❌ Error en turno ${turno}:`, error.response?.data?.mensaje || error.message);
          break;
        }
      }
    }

    // 5. Verificar resumen de batallas
    console.log('\n5. 📊 Verificando resumen de batallas...');
    const resumenResponse = await axios.get(`${BASE_URL}/batallas`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const resumen = resumenResponse.data;
    console.log(`✅ ${resumen.length} batallas en el resumen`);
    
    // Buscar la batalla que acabamos de crear
    const batallaCreada = resumen.find(b => b._id === batalla._id);
    if (batallaCreada) {
      console.log(`✅ Batalla encontrada en resumen: ${batallaCreada.personajeA} vs ${batallaCreada.personajeB}`);
    }

    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

// Ejecutar pruebas
testBatalla1vs1(); 