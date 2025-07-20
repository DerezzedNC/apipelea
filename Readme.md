# API de Batallas

API REST para gestionar personajes y batallas usando Express, MongoDB y Swagger.

## Características

- ✅ CRUD completo de personajes
- ✅ Sistema de batallas 1vs1 por turnos
- ✅ Sistema de batallas 3vs3 por equipos
- ✅ Validaciones robustas de datos
- ✅ Documentación Swagger interactiva
- ✅ Manejo de errores mejorado
- ✅ Validación de ObjectId
- ✅ Estructura escalable para futuras funcionalidades

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Crear archivo `.env` en la raíz del proyecto:
```
# Para MongoDB Atlas:
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/apibatallas?retryWrites=true&w=majority

# Para MongoDB local:
# MONGODB_URI=mongodb://localhost:27017/apibatallas

PORT=3000
```

3. **Para MongoDB Atlas**: Reemplaza `usuario`, `password` y `cluster.mongodb.net` con tus credenciales reales
4. **Para MongoDB local**: Asegúrate de tener MongoDB corriendo localmente

## Uso

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Endpoints

### Personajes
- `GET /` - Verificar estado de la API
- `GET /api-docs` - Documentación Swagger interactiva
- `POST /api/personajes` - Crear personaje
- `GET /api/personajes` - Obtener todos los personajes
- `GET /api/personajes/:id` - Obtener personaje por ID
- `PUT /api/personajes/:id` - Actualizar personaje
- `DELETE /api/personajes/:id` - Eliminar personaje

### Batallas
- `POST /api/batallas/1vs1` - Crear batalla o ejecutar turno
- `GET /api/batallas` - Obtener resumen de todas las batallas

### Batallas 3vs3
- `POST /api/batallas/3vs3/crear` - Crear batalla 3vs3
- `POST /api/batallas/3vs3/orden` - Configurar orden de rondas
- `POST /api/batallas/3vs3/round1/:batallaId` - Ejecutar turno ronda 1
- `POST /api/batallas/3vs3/round2/:batallaId` - Ejecutar turno ronda 2
- `POST /api/batallas/3vs3/round3/:batallaId` - Ejecutar turno ronda 3
- `GET /api/batallas/3vs3/resumen` - Obtener resumen de batallas 3vs3

## Estructura del Personaje

```json
{
  "nombre": "string (2-50 caracteres, solo letras y espacios)",
  "vida": "number (1-1000)",
  "ataque": "number (1-200)",
  "escudo": "number (0-100)"
}
```

## Validaciones

- **Nombre**: Solo letras y espacios, entre 2-50 caracteres
- **Vida**: Entre 1-1000 puntos
- **Ataque**: Entre 1-200 puntos
- **Escudo**: Entre 0-100 puntos
- **ID**: Validación de ObjectId para operaciones por ID

## Sistema de Batallas

### Batallas 1vs1:
1. **Crear batalla**: Envía los IDs de dos personajes para crear una nueva batalla
2. **Ejecutar turnos**: La misma ruta ejecuta turnos alternados (personajeA → personajeB → personajeA...)
3. **Mecánica de daño**: El daño se aplica primero al escudo, luego a la vida
4. **Finalización**: La batalla termina cuando la vida de un personaje llega a 0

### Batallas 3vs3:
1. **Crear batalla**: Envía los datos completos de 6 personajes (3 para cada equipo) y la configuración de rondas
2. **Ejecutar rondas**: Cada ronda se ejecuta por separado con turnos alternados
3. **Determinar ganador**: El equipo con más victorias gana la batalla

### Ejemplos de uso:

#### Batalla 1vs1:
```json
POST /api/batallas/1vs1
{
  "personajeAId": "507f1f77bcf86cd799439011",
  "personajeBId": "507f1f77bcf86cd799439012"
}
```

#### Batalla 3vs3:
```json
POST /api/batallas/3vs3/crear
{
  "teamA": [
    {
      "id": "id1",
      "nombre": "Guerrero",
      "vida": 100,
      "escudo": 20,
      "ataque": 30
    },
    {
      "id": "id2", 
      "nombre": "Mago",
      "vida": 80,
      "escudo": 10,
      "ataque": 40
    },
    {
      "id": "id3",
      "nombre": "Arquero", 
      "vida": 90,
      "escudo": 15,
      "ataque": 35
    }
  ],
  "teamB": [
    {
      "id": "id4",
      "nombre": "Paladín",
      "vida": 120,
      "escudo": 25,
      "ataque": 25
    },
    {
      "id": "id5",
      "nombre": "Berserker",
      "vida": 70,
      "escudo": 5,
      "ataque": 50
    },
    {
      "id": "id6",
      "nombre": "Monje",
      "vida": 85,
      "escudo": 30,
      "ataque": 20
    }
  ],
  "ordenRondas": [
    {"a": 0, "b": 1},
    {"a": 1, "b": 2},
    {"a": 2, "b": 0}
  ]
}
```

## Próximas Funcionalidades

- Daño degenerativo
- Pruebas automatizadas
- Frontend visual para interacción

## Solución de Problemas

### Error de Conexión a MongoDB
- **ECONNREFUSED**: Verifica que MongoDB esté corriendo
- **Authentication failed**: Verifica las credenciales en tu archivo `.env`
- **ENOTFOUND**: Verifica la URL de conexión en tu archivo `.env`

### Formato de URI de MongoDB Atlas
```
mongodb+srv://usuario:password@cluster.mongodb.net/nombre-db?retryWrites=true&w=majority
```

### Variables de Entorno Requeridas
- `MONGODB_URI`: URI de conexión a MongoDB
- `PORT`: Puerto del servidor (opcional, por defecto 3000)
