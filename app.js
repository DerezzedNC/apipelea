const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

const conectarDB = require('./config/db');
const specs = require('./swagger/swaggerConfig');
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

// Rutas
app.use('/api/personajes', personajeRoutes);
app.use('/api/batallas', batallaRoutes);
app.use('/api/batallas', batalla3vs3Routes); // 👈 cambio aquí (antes tenía /3vs3)

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Batallas funcionando correctamente' });
});

// Middleware 404 - Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Algo salió mal!' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Documentación disponible en: http://localhost:${PORT}/api-docs`);
});
