// Script simple para simular localStorage del frontend
const axios = require('axios');

const BASE_URL = 'https://apipelea.onrender.com/api';

async function testFrontendSimulation() {
  try {
    console.log('🧪 Simulando frontend...\n');

    // 1. Login para obtener token
    console.log('1. 🔐 Obteniendo token...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      nombre: 'Angel',
      password: '123456'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Token obtenido\n');

    // 2. Obtener personajes
    console.log('2. 👥 Obteniendo personajes...');
    const personajesResponse = await axios.get(`${BASE_URL}/personajes`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const personajes = personajesResponse.data;
    console.log(`✅ ${personajes.length} personajes obtenidos\n`);

    // 3. Simular localStorage
    const localStorageData = {
      token: token,
      personajeA: personajes[2]._id, // thanos
      personajeB: personajes[3]._id, // wolverine
      batallaId: null
    };

    console.log('3. 💾 Simulando localStorage:');
    console.log(`   Token: ${token ? 'Presente' : 'Ausente'}`);
    console.log(`   Personaje A: ${personajes[2].nombre} (${personajes[2]._id})`);
    console.log(`   Personaje B: ${personajes[3].nombre} (${personajes[3]._id})`);
    console.log(`   Batalla ID: ${localStorageData.batallaId || 'No creada'}\n`);

    // 4. Crear batalla
    console.log('4. ⚔️ Creando batalla...');
    const batallaResponse = await axios.post(`${BASE_URL}/batallas/1vs1`, {
      personajeA: localStorageData.personajeA,
      personajeB: localStorageData.personajeB
    }, {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    
    const batalla = batallaResponse.data;
    localStorageData.batallaId = batalla._id;
    
    console.log(`✅ Batalla creada: ${batalla._id}`);
    console.log(`   Personaje A: ${personajes[2].nombre} (HP: ${personajes[2].vida})`);
    console.log(`   Personaje B: ${personajes[3].nombre} (HP: ${personajes[3].vida})\n`);

    // 5. Simular ejecución de turnos (como lo haría el frontend)
    console.log('5. 🎯 Simulando ejecución de turnos...');
    
    for (let turno = 1; turno <= 3; turno++) {
      console.log(`   --- Turno ${turno} ---`);
      
      try {
        // Simular la petición del frontend
        const turnoResponse = await axios.post(`${BASE_URL}/batallas/${localStorageData.batallaId}/turno`, {}, {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorageData.token}`
          }
        });
        
        const turnoData = turnoResponse.data;
        console.log(`   ✅ ${turnoData.mensaje}`);
        console.log(`   Atacante: ${turnoData.atacante.nombre}`);
        console.log(`   Defensor: ${turnoData.defensor.nombre}`);
        console.log(`   Daño: ${turnoData.daño}`);
        console.log(`   Personaje A HP: ${turnoData.personajeA.vida}, ESC: ${turnoData.personajeA.escudo}`);
        console.log(`   Personaje B HP: ${turnoData.personajeB.vida}, ESC: ${turnoData.personajeB.escudo}`);
        
        if (turnoData.ganador) {
          console.log(`   🏆 ¡Ganador: ${turnoData.ganador}!`);
          break;
        }
        
      } catch (error) {
        console.log(`   ❌ Error en turno ${turno}:`, error.response?.data?.mensaje || error.message);
        break;
      }
    }

    console.log('\n🎉 ¡Simulación de frontend completada!');
    console.log('✅ El sistema está listo para usar en el HTML');
    
  } catch (error) {
    console.error('❌ Error en la simulación:', error.response?.data || error.message);
  }
}

// Ejecutar simulación
testFrontendSimulation(); 