const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./app.js']; // Puedes cambiar esto si defines tus rutas en otro archivo

const doc = {
  info: {
    title: 'API de Batallas',
    description: 'Documentación autogenerada con swagger-autogen',
  },
  host: 'apipelea.onrender.com',
  schemes: ['https'],
};

swaggerAutogen(outputFile, endpointsFiles, doc);
