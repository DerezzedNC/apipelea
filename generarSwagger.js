const fs = require('fs');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// Importa la configuración actual de Swagger
const swaggerConfig = require('./swagger/swaggerConfig');

// Si swaggerConfig ya es el spec generado, úsalo directamente
const swaggerSpec = swaggerConfig.openapi ? swaggerConfig : swaggerJsdoc(swaggerConfig);

// Escribe el resultado en swagger.json en la raíz del proyecto
fs.writeFileSync(path.join(__dirname, 'swagger.json'), JSON.stringify(swaggerSpec, null, 2), 'utf8');

console.log('✅ Archivo swagger.json generado correctamente en la raíz del proyecto.'); 