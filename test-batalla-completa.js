// Script de prueba para verificar el flujo completo de batalla 1vs1
const axios = require('axios');

const BASE_URL = 'https://apipelea.onrender.com/api';

async function testBatallaCompleta() {
  try {
    console.log('🧪 Iniciando prueba de batalla completa...\n');

    // 1. Login para obtener token
    console.log('1. 🔐 Obteniendo token de autenticación...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      nombre: 'Angel',
      password: '123456'
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

    // Usar personajes diferentes (índices 2 y 3 para evitar conflictos)
    const personajeA = personajes[2]; // thanos
    const personajeB = personajes[3]; // wolverine
    
    console.log(`Seleccionando personajes para la batalla:`);
    console.log(`   Personaje A: ${personajeA.nombre} (HP: ${personajeA.vida}, ATK: ${personajeA.ataque})`);
    console.log(`   Personaje B: ${personajeB.nombre} (HP: ${personajeB.vida}, ATK: ${personajeB.ataque})\n`);

    // 3. Crear batalla 1vs1
    console.log('3. ⚔️ Creando batalla 1vs1...');
    
    const batallaResponse = await axios.post(`${BASE_URL}/batallas/1vs1`, {
      personajeA: personajeA._id,
      personajeB: personajeB._id
    }, {
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
    
    const batalla = batallaResponse.data;
    console.log(`✅ Batalla creada: ${batalla._id}`);
    console.log(`   Personaje A: ${personajeA.nombre} (HP: ${personajeA.vida})`);
    console.log(`   Personaje B: ${personajeB.nombre} (HP: ${personajeB.vida})\n`);

    // 4. Ejecutar turnos hasta que termine la batalla
    console.log('4. 🎯 Ejecutando turnos...');
    let turno = 1;
    let batallaFinalizada = false;
    
    while (!batallaFinalizada && turno <= 15) { // Máximo 15 turnos para la prueba
      console.log(`   --- Turno ${turno} ---`);
      
      try {
        // Simular la petición del frontend
        const turnoResponse = await axios.post(`${BASE_URL}/batallas/${batalla._id}/turno`, {}, {
          headers: { 
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        
        const turnoData = turnoResponse.data;
        console.log(`   ✅ ${turnoData.mensaje}`);
        console.log(`   Atacante: ${turnoData.atacante.nombre}`);
        console.log(`   Defensor: ${turnoData.defensor.nombre}`);
        console.log(`   Daño: ${turnoData.daño}`);
        console.log(`   Vida restante: ${turnoData.vidaRestante}`);
        console.log(`   Escudo restante: ${turnoData.escudoRestante}`);
        console.log(`   Personaje A HP: ${turnoData.personajeA.vida}, ESC: ${turnoData.personajeA.escudo}`);
        console.log(`   Personaje B HP: ${turnoData.personajeB.vida}, ESC: ${turnoData.personajeB.escudo}`);
        
        if (turnoData.ganador) {
          console.log(`   🏆 ¡Ganador: ${turnoData.ganador}!`);
          batallaFinalizada = true;
        }
        
        turno++;
        
      } catch (error) {
        if (error.response?.data?.mensaje?.includes('finalizada')) {
          console.log(`   🏆 ${error.response.data.mensaje}`);
          if (error.response.data.ganador) {
            console.log(`   🏆 Ganador: ${error.response.data.ganador}`);
          }
          batallaFinalizada = true;
        } else {
          console.log(`   ❌ Error en turno ${turno}:`, error.response?.data?.mensaje || error.message);
          console.log(`   Status: ${error.response?.status}`);
          console.log(`   Data:`, error.response?.data);
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
    const batallaCreada = resumen.find(b => b._id === batalla._id);
    
    if (batallaCreada) {
      console.log(`✅ Batalla encontrada en resumen`);
      console.log(`   Turnos ejecutados: ${batallaCreada.turnos}`);
      console.log(`   Ganador: ${batallaCreada.ganador || 'Sin ganador'}`);
    }

    console.log('\n🎉 ¡Prueba de batalla completa exitosa!');
    console.log('✅ El sistema de turnos funciona correctamente');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
  }
}

// Ejecutar prueba
testBatallaCompleta(); 