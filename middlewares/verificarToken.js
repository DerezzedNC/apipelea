const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verificarToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ mensaje: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    req.user = {
      id: user._id,
      nombre: user.nombre,
      rol: user.rol
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ mensaje: 'Token inválido' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ mensaje: 'Token expirado' });
    }
    res.status(500).json({ mensaje: 'Error al verificar token' });
  }
};

module.exports = verificarToken; 