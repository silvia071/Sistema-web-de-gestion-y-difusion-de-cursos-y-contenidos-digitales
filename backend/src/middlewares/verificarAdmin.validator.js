const verificarAdmin = (req, res, next) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        mensaje: "No autorizado",
      });
    }

    if (req.usuario.rol !== "ADMINISTRADOR") {
      return res.status(403).json({
        mensaje: "Acceso denegado. Se requiere rol administrador.",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
    });
  }
};

module.exports = { verificarAdmin };
