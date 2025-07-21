const User = require('../models/User');

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nombre, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ nombre });

    if (existingUser) {
      return res.status(400).json({ 
        mensaje: 'El nombre de usuario ya está registrado' 
      });
    }

    // Crear nuevo usuario (rol se establece automáticamente como 'usuario')
    const user = new User({
      nombre,
      password
    });

    await user.save();

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente'
    });

  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { nombre, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ nombre });
    if (!user) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Verificar password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas' });
    }

    // Generar token
    const token = user.generateToken();

    res.json({
      mensaje: 'Login exitoso',
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        rol: user.rol
      }
    });

  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// GET /api/auth/me
const getProfile = async (req, res) => {
  try {
    res.json({
      user: req.user
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile
}; 