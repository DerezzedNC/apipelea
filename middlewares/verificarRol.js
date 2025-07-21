const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ mensaje: 'Usuario no autenticado' });
    }

    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ 
        mensaje: 'Acceso denegado. No tienes permisos para esta acción' 
      });
    }

    next();
  };
};

module.exports = verificarRol; 