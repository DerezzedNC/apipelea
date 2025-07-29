const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
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

// Archivos estáticos (HTML, CSS, JS desde carpeta public/)
app.use(express.static(path.join(__dirname, 'public')));

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/personajes', personajeRoutes);
app.use('/api/batallas', batallaRoutes);
app.use('/api/batallas/3vs3', batalla3vs3Routes);

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/docs-json', express.static(path.join(__dirname, 'swagger-output.json')));

// Ruta raíz - redirige a index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Middleware 404 (para rutas que no existen)
app.use((req, res, next) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html')); // Opcional: si tienes un 404.html
  } else {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
  }
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error('Error interno:', err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📘 Swagger disponible en http://localhost:${PORT}/api-docs`);
});
