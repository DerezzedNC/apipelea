const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const path = require('path'); // ✅ CORRECCIÓN
require('dotenv').config();

// Conexión BD y rutas
const conectarDB = require('./config/db');
const specs = require('./swagger/swaggerConfig');
const authRoutes = require('./routes/authRoutes');
const personajeRoutes = require('./routes/personajeRoutes');
const batallaRoutes = require('./routes/batallaRoutes');
const batalla3vs3Routes = require('./routes/batalla3vs3Routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
conectarDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/personajes', personajeRoutes);
app.use('/api/batallas', batallaRoutes);
app.use('/api/batallas/3vs3', batalla3vs3Routes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/docs-json', express.static(path.join(__dirname, 'swagger-output.json')));

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Batallas - Backend',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      personajes: '/api/personajes',
      batallas: '/api/batallas',
      batallas3vs3: '/api/batallas/3vs3',
      swagger: '/api-docs'
    }
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ 
    mensaje: 'Ruta no encontrada',
    endpoint: req.originalUrl,
    metodo: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error interno:', err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📘 Swagger disponible en http://localhost:${PORT}/api-docs`);
});
