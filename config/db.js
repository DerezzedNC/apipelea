const mongoose = require('mongoose');
require('dotenv').config();

const conectarDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    
    if (!mongoURI) {
      throw new Error("❌ No se encontró la variable de entorno MONGO_URI");
    }

    console.log('🔌 Intentando conectar a MongoDB...');
    console.log(`📍 URI: ${mongoURI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`);

    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log(`✅ MongoDB conectado exitosamente`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`📊 Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:');
    console.error(`   ${error.message}`);

    if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Verifica que MongoDB esté corriendo y accesible');
    } else if (error.message.includes('Authentication failed')) {
      console.error('💡 Verifica usuario y contraseña en MONGO_URI');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('💡 Verifica el nombre del clúster de MongoDB Atlas');
    }

    process.exit(1);
  }
};

module.exports = conectarDB;
