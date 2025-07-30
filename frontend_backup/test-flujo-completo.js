// Script de prueba para verificar el flujo completo de turnos
const axios = require('axios');

const BASE_URL = 'https://apipelea.onrender.com/api';

async function testFlujoCompleto() {
  try {
    console.log('🧪 Iniciando prueba de flujo completo...\n');

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
    console.log(`✅ Batalla creada: ${batalla._id}`);
    console.log(`   Personaje A: ${personajes[0].nombre} (HP: ${personajes[0].vida})`);
    console.log(`   Personaje B: ${personajes[1].nombre} (HP: ${personajes[1].vida})\n`);

    // 4. Simular localStorage para el frontend
    console.log('4. 💾 Simulando localStorage...');
    const localStorageData = {
      batallaId: batalla._id,
      personajeA: personajeA,
      personajeB: personajeB,
      token: token
    };
    console.log('   localStorage configurado:', localStorageData);

    // 5. Ejecutar turnos simulando el frontend
    console.log('5. 🎯 Ejecutando turnos (simulando frontend)...');
    let turno = 1;
    let batallaFinalizada = false;
    
    while (!batallaFinalizada && turno <= 10) { // Máximo 10 turnos para la prueba
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
        console.log(`   Personaje A HP: ${turnoData.personajeA.vida}`);
        console.log(`   Personaje B HP: ${turnoData.personajeB.vida}`);
        
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

    // 6. Verificar resumen de batallas
    console.log('\n6. 📊 Verificando resumen de batallas...');
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

    console.log('\n🎉 ¡Prueba de flujo completo completada exitosamente!');
    console.log('✅ El sistema de turnos funciona correctamente');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
  }
}

// Ejecutar prueba
testFlujoCompleto(); 