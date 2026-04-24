const express = require("express");
const router = express.Router();
const AccesoCurso = require("../models/accesoCurso.model");

// 🔹 OBTENER CURSOS DEL USUARIO
router.get("/usuario/:usuarioId", async (req, res) => {
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
});

// 🔥 NUEVO ENDPOINT (EL QUE TE FALTABA)
router.patch("/progreso", async (req, res) => {
  try {
    const { usuarioId, cursoId, progreso } = req.body;

    if (!usuarioId || !cursoId || progreso == null) {
      return res.status(400).json({
        error: "usuarioId, cursoId y progreso son obligatorios",
      });
    }

    const acceso = await AccesoCurso.findOne({
      usuario: usuarioId,
      curso: cursoId,
    });

    if (!acceso) {
      return res.status(404).json({
        error: "Acceso al curso no encontrado",
      });
    }

    acceso.progreso = progreso;
    await acceso.save();

    res.json(acceso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
