const AccesoCurso = require("../models/accesoCurso.model");
const Leccion = require("../models/leccion.model");
const Curso = require("../models/curso.model");

const obtenerUsuarioId = (req) => {
  return req.usuario?._id || null;
};

const obtenerCursoId = (req) => {
  return req.params?.cursoId || req.body?.curso || null;
};

const esAdministrador = (req) => {
  return req.usuario?.rol === "ADMINISTRADOR";
};

const validarAccesoPorCurso = async (req, res, next) => {
  try {
    if (esAdministrador(req)) {
      return next();
    }

    const usuarioId = obtenerUsuarioId(req);
    const cursoId = obtenerCursoId(req);

    if (!usuarioId) {
      return res.status(400).json({
        mensaje: "El usuarioId es obligatorio",
      });
    }

    if (!cursoId) {
      return res.status(400).json({
        mensaje: "El cursoId es obligatorio",
      });
    }

    const curso = await Curso.findById(cursoId);

    if (!curso) {
      return res.status(404).json({
        mensaje: "Curso no encontrado",
      });
    }

    if (curso.estado !== "PUBLICADO") {
      return res.status(403).json({
        mensaje: "Este curso no se encuentra disponible actualmente",
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
    if (esAdministrador(req)) {
      return next();
    }

    const usuarioId = obtenerUsuarioId(req);
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

    const curso = await Curso.findById(leccion.curso);

    if (!curso) {
      return res.status(404).json({
        mensaje: "Curso no encontrado",
      });
    }

    if (curso.estado !== "PUBLICADO") {
      return res.status(403).json({
        mensaje: "Este curso no se encuentra disponible actualmente",
      });
    }

    if (leccion.estado !== "PUBLICADO") {
      return res.status(403).json({
        mensaje: "Esta lección no se encuentra disponible actualmente",
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
