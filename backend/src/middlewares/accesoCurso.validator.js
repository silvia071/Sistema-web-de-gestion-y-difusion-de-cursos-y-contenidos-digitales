const AccesoCurso = require("../models/accesoCurso.model");
const Leccion = require("../models/leccion.model");

const validarAccesoPorCurso = async (req, res, next) => {
  try {
    const { usuarioId } = req.body;
    const { cursoId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({
        mensaje: "El usuarioId es obligatorio",
      });
    }

    const acceso = await AccesoCurso.findOne({
      usuario: usuarioId,
      curso: cursoId,
      estado: "ACTIVO",
    });

    if (!acceso) {
      return res.status(403).json({
        mensaje: "No tenés acceso a este curso",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al validar acceso al curso",
      detalle: error.message,
    });
  }
};

const validarAccesoPorLeccion = async (req, res, next) => {
  try {
    const { usuarioId } = req.body;
    const { id } = req.params;

    if (!usuarioId) {
      return res.status(400).json({
        mensaje: "El usuarioId es obligatorio",
      });
    }

    const leccion = await Leccion.findById(id);

    if (!leccion) {
      return res.status(404).json({
        mensaje: "Lección no encontrada",
      });
    }

    const acceso = await AccesoCurso.findOne({
      usuario: usuarioId,
      curso: leccion.curso,
      estado: "ACTIVO",
    });

    if (!acceso) {
      return res.status(403).json({
        mensaje: "No tenés acceso a esta lección",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al validar acceso a la lección",
      detalle: error.message,
    });
  }
};

module.exports = {
  validarAccesoPorCurso,
  validarAccesoPorLeccion,
};
