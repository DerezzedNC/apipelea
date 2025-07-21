const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

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
    path.join(__dirname, '../routes/*.js'),
    path.join(__dirname, '../models/*.js'),
    path.join(__dirname, './*.js'),
  ],
};

const specs = swaggerJsdoc(options);

// Debug (opcional):
console.log('📚 Swagger configurado con las siguientes rutas absolutas:');
console.log(options.apis);
console.log('Swagger paths encontrados:', specs.paths ? Object.keys(specs.paths) : 'No hay paths');

module.exports = specs;
