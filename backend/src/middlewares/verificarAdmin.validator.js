const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const verificarAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ mensaje: 'Token de autenticación requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    if (!usuario.esAdministrador()) {
      return res.status(403).json({ mensaje: 'Acceso denegado: se requiere rol de administrador' });
    }

    req.user = usuario;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido' });
  }
};

module.exports = { verificarAdmin };