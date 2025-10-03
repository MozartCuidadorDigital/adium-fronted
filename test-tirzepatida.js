// Script de prueba para verificar la funcionalidad de tirzepatida
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:3001/api/totem';

async function testTirzepatidaFunctionality() {
  console.log('🧪 Probando funcionalidad de tirzepatida...\n');

  try {
    // Test 1: Obtener preguntas predefinidas
    console.log('1️⃣ Obteniendo preguntas predefinidas...');
    const questionsResponse = await fetch(`${API_BASE_URL}/questions`);
    const questionsData = await questionsResponse.json();
    
    if (questionsData.success) {
      console.log('✅ Preguntas predefinidas obtenidas correctamente');
      const tirzepatidaQuestion = questionsData.questions.find(q => q.id === 'sobre-tirzepatida');
      if (tirzepatidaQuestion) {
        console.log('✅ Pregunta "Sobre tirzepatida" encontrada:', tirzepatidaQuestion.text);
      } else {
        console.log('❌ Pregunta "Sobre tirzepatida" no encontrada');
      }
    } else {
      console.log('❌ Error obteniendo preguntas:', questionsData.error);
    }

    // Test 2: Obtener preguntas específicas de tirzepatida
    console.log('\n2️⃣ Obteniendo preguntas específicas de tirzepatida...');
    const tirzepatidaResponse = await fetch(`${API_BASE_URL}/tirzepatida-questions`);
    const tirzepatidaData = await tirzepatidaResponse.json();
    
    if (tirzepatidaData.success) {
      console.log('✅ Preguntas de tirzepatida obtenidas correctamente');
      console.log(`📊 Total de preguntas: ${tirzepatidaData.questions.length}`);
      tirzepatidaData.questions.forEach((q, index) => {
        console.log(`   ${index + 1}. ${q.text}`);
      });
    } else {
      console.log('❌ Error obteniendo preguntas de tirzepatida:', tirzepatidaData.error);
    }

    // Test 3: Probar menú de tirzepatida
    console.log('\n3️⃣ Probando menú de tirzepatida...');
    const menuResponse = await fetch(`${API_BASE_URL}/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: 'Sobre tirzepatida'
      })
    });
    const menuData = await menuResponse.json();
    
    if (menuData.success && menuData.isMenu) {
      console.log('✅ Menú de tirzepatida funcionando correctamente');
      console.log('📋 Texto del menú:', menuData.text);
      console.log(`📊 Preguntas en el menú: ${menuData.menuQuestions.length}`);
    } else {
      console.log('❌ Error en menú de tirzepatida:', menuData);
    }

    // Test 4: Probar pregunta específica de tirzepatida
    console.log('\n4️⃣ Probando pregunta específica de tirzepatida...');
    const specificResponse = await fetch(`${API_BASE_URL}/question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: '¿Qué es tirzepatida?'
      })
    });
    const specificData = await specificResponse.json();
    
    if (specificData.success && specificData.predefined) {
      console.log('✅ Respuesta predefinida de tirzepatida funcionando');
      console.log('📝 Longitud de la respuesta:', specificData.text.length, 'caracteres');
      console.log('🎵 Audio generado:', specificData.audioUrl ? 'Sí' : 'No');
    } else {
      console.log('❌ Error en respuesta predefinida:', specificData);
    }

    console.log('\n🎉 Pruebas completadas!');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
  }
}

// Ejecutar las pruebas
testTirzepatidaFunctionality();
