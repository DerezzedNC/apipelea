const mongoose = require('mongoose');
require('dotenv').config();

const conectarDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/apibatallas';
    
    console.log('🔌 Intentando conectar a MongoDB...');
    console.log(`📍 URI: ${mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Oculta credenciales en logs
    
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB conectado exitosamente`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`🔗 Puerto: ${conn.connection.port}`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:');
    console.error(`   ${error.message}`);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Verifica que MongoDB esté corriendo');
    } else if (error.message.includes('Authentication failed')) {
      console.error('💡 Verifica las credenciales en tu archivo .env');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Verifica la URL de conexión en tu archivo .env');
    }
    
    process.exit(1);
  }
};

module.exports = conectarDB;
