# API de Batallas con Autenticación JWT

API REST para gestionar personajes y batallas con sistema de autenticación JWT y control de roles.

## Características

- ✅ Autenticación JWT
- ✅ Sistema de roles (admin/usuario)
- ✅ Control de acceso basado en roles
- ✅ Filtrado de datos por usuario
- ✅ Batallas 1vs1 y 3vs3
- ✅ Documentación Swagger
- ✅ MongoDB con Mongoose

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` con las siguientes variables:
```env
MONGODB_URI=mongodb://localhost:27017/batallas
PORT=3000
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
```

4. Iniciar el servidor:
```bash
npm start
```

## Autenticación

### Registro
```bash
POST /api/auth/register
{
  "nombre": "usuario1",
  "password": "123456"
}

# Respuesta:
{
  "mensaje": "Usuario registrado correctamente"
}
```

### Login
```bash
POST /api/auth/login
{
  "nombre": "usuario1",
  "password": "123456"
}

# Respuesta:
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "nombre": "usuario1",
    "rol": "usuario"
  }
}
```

## Roles y Permisos

### Usuario Normal (`rol: "usuario"`)
- ✅ Hacer login
- ✅ Ver personajes existentes
- ✅ Crear batallas 1vs1 y 3vs3
- ✅ Ejecutar turnos de batallas
- ✅ Ver solo sus propias batallas

### Administrador (`rol: "admin"`)
- ✅ Todas las funciones de usuario normal
- ✅ Crear, editar y eliminar personajes
- ✅ Ver todas las batallas de todos los usuarios
- ✅ Acceso a resúmenes globales

## Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login de usuario
- `GET /api/auth/me` - Obtener perfil (requiere token)

### Personajes
- `GET /api/personajes` - Ver todos los personajes
- `GET /api/personajes/:id` - Ver personaje específico
- `POST /api/personajes` - Crear personaje (solo admin)
- `PUT /api/personajes/:id` - Editar personaje (solo admin)
- `DELETE /api/personajes/:id` - Eliminar personaje (solo admin)

### Batallas 1vs1
- `POST /api/batallas/1vs1` - Crear batalla 1vs1
- `GET /api/batallas` - Ver resumen de batallas

### Batallas 3vs3
- `POST /api/batallas/3vs3/crear` - Crear batalla 3vs3
- `PUT /api/batallas/3vs3/:id/ordenar` - Configurar orden de rondas
- `POST /api/batallas/3vs3/round1/:batallaId` - Ejecutar ronda 1
- `POST /api/batallas/3vs3/round2/:batallaId` - Ejecutar ronda 2
- `POST /api/batallas/3vs3/round3/:batallaId` - Ejecutar ronda 3
- `GET /api/batallas/3vs3/resumen` - Ver resumen de batallas 3vs3

## Uso del Token

Para endpoints protegidos, incluir el token en el header:
```
Authorization: Bearer <tu_token_jwt>
```

## Documentación Swagger

Acceder a la documentación interactiva en:
```
http://localhost:3000/api-docs
```

## Estructura del Proyecto

```
├── app.js                 # Archivo principal
├── config/
│   └── db.js             # Configuración de MongoDB
├── controllers/
│   ├── authController.js  # Controlador de autenticación
│   ├── personajeController.js
│   ├── batallaController.js
│   └── batalla3vs3Controller.js
├── middlewares/
│   ├── verificarToken.js  # Middleware de autenticación
│   └── verificarRol.js    # Middleware de roles
├── models/
│   ├── User.js           # Modelo de usuario
│   ├── personaje.js
│   ├── batalla.js
│   └── batalla3vs3.js
├── routes/
│   ├── authRoutes.js     # Rutas de autenticación
│   ├── personajeRoutes.js
│   ├── batallaRoutes.js
│   └── batalla3vs3Routes.js
└── swagger/
    └── swaggerConfig.js  # Configuración de Swagger
```
