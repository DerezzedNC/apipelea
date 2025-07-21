const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ mensaje: 'Token requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuario en la base de datos para obtener información completa
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(403).json({ mensaje: 'Token inválido' });
    }

    // Agregar información completa del usuario al request
    req.user = {
      id: user._id,
      nombre: user.nombre,
      rol: user.rol
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ mensaje: 'Token inválido' });
    }
    res.status(500).json({ mensaje: 'Error al verificar token' });
  }
};

module.exports = authMiddleware; 