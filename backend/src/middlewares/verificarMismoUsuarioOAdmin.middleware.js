const verificarMismoUsuarioOAdmin = (req, res, next) => {
  try {
    const idParam = req.params.id;
    const usuarioLogueado = req.user;

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
