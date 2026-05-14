const verificarMismoUsuarioOAdmin = (req, res, next) => {
  try {
    const idParam = req.params.id;
    const usuarioLogueado = req.usuario;

    if (!usuarioLogueado) {
      return res.status(401).json({
        mensaje: "No autorizado. Usuario no autenticado",
      });
    }

    if (!idParam) {
      return res.status(400).json({
        mensaje: "ID requerido",
      });
    }

    if (
      usuarioLogueado._id.toString() === idParam ||
      usuarioLogueado.rol === "ADMINISTRADOR"
    ) {
      return next();
    }

    return res.status(403).json({
      mensaje: "No tenés permisos para realizar esta acción",
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al verificar permisos",
      detalle: error.message,
    });
  }
};

module.exports = { verificarMismoUsuarioOAdmin };
