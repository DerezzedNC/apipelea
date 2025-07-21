const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Batallas',
      version: '1.0.0',
      description: 'API para gestionar personajes, batallas 1vs1 y 3vs3 con autenticación JWT',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'https://apipelea.onrender.com',
        description: 'Servidor dinámico: producción (Render) o desarrollo (localhost)',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './routes/*.js',    // Define los endpoints
    './models/*.js',    // Documentación de esquemas si usas JSDoc en modelos
    './swagger/*.js',   // Archivos personalizados de Swagger como authDoc.js
  ],
};

const specs = swaggerJsdoc(options);

// Debug (opcional):
console.log('📚 Swagger configurado con las siguientes rutas:');
console.log('- ./routes/*.js');
console.log('- ./models/*.js');
console.log('- ./swagger/*.js');

module.exports = specs;
