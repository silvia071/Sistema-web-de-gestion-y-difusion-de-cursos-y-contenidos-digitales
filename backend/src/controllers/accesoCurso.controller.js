const AccesoCurso = require("../models/accesoCurso.model");

// 🔹 OBTENER CURSOS DEL USUARIO
const obtenerAccesosUsuario = async (req, res) => {
  try {
    const accesos = await AccesoCurso.find({
      usuario: req.params.usuarioId,
      estado: "ACTIVO",
    }).populate("curso");

    res.json(accesos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener cursos del usuario",
      detalle: error.message,
    });
  }
};

// 🔹 CREAR ACCESO AUTOMÁTICO
const crearAccesoCurso = async (req, res) => {
  try {
    const { usuarioId, cursoId } = req.body;

    if (!usuarioId || !cursoId) {
      return res.status(400).json({
        error: "usuarioId y cursoId son obligatorios",
      });
    }

    const accesoExistente = await AccesoCurso.findOne({
      usuario: usuarioId,
      curso: cursoId,
    });

    if (accesoExistente) {
      return res.json(accesoExistente);
    }

    const nuevoAcceso = new AccesoCurso({
      usuario: usuarioId,
      curso: cursoId,
      progreso: 0,
      estado: "ACTIVO",
    });

    await nuevoAcceso.save();

    res.status(201).json(nuevoAcceso);
  } catch (error) {
    res.status(500).json({
      error: "Error al crear acceso",
      detalle: error.message,
    });
  }
};

// 🔹 ACTUALIZAR PROGRESO
const actualizarProgreso = async (req, res) => {
  try {
    const { progreso, ultimaLeccion } = req.body;

    const acceso = await AccesoCurso.findById(req.params.id);

    if (!acceso) {
      return res.status(404).json({
        error: "Acceso al curso no encontrado",
      });
    }

    if (progreso != null) {
      acceso.progreso = progreso;
    }

    if (ultimaLeccion != null) {
      acceso.ultimaLeccion = ultimaLeccion;
    }

    await acceso.save();

    res.json(acceso);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
module.exports = {
  obtenerAccesosUsuario,
  crearAccesoCurso,
  actualizarProgreso,
};
