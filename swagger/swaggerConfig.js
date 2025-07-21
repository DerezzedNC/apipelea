const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Batallas',
      version: '1.0.0',
      description: 'API para gestionar personajes y batallas con autenticación JWT',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
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
  },
  apis: [
    './swagger/authDoc.js',
    './routes/*.js',
    './models/*.js', 
    './swagger/*.js'
  ],
};

const specs = swaggerJsdoc(options);

// Debug: Imprimir las rutas que se están procesando
console.log('Swagger configurado con las siguientes rutas:');
console.log('- ./routes/*.js');
console.log('- ./models/*.js');
console.log('- ./swagger/*.js');

module.exports = specs;
