const mongoose = require("mongoose");
const leccionService = require("../services/leccion.service");

const crearLeccion = async (req, res) => {
  try {
    const leccion = await leccionService.crearLeccion(req.body);
    res.status(201).json(leccion);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const editarLeccion = async (req, res) => {
  try {
    const leccion = await leccionService.editarLeccion(req.params.id, req.body);

    if (!leccion) {
      return res.status(404).json({ mensaje: "Lección no encontrada" });
    }

    res.json(leccion);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const eliminarLeccion = async (req, res) => {
  try {
    const leccion = await leccionService.eliminarLeccion(req.params.id);

    if (!leccion) {
      return res.status(404).json({ mensaje: "Lección no encontrada" });
    }

    res.json({ mensaje: "Lección eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const listarLeccionesPorCurso = async (req, res) => {
  try {
    const lecciones = await leccionService.listarLeccionesPorCurso(
      req.params.cursoId,
    );
    res.json(lecciones);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const buscarLeccionPorId = async (req, res) => {
  try {
    const leccion = await leccionService.buscarLeccionPorId(req.params.id);

    if (!leccion) {
      return res.status(404).json({ mensaje: "Lección no encontrada" });
    }

    res.json(leccion);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const publicarLeccion = async (req, res) => {
  try {
    const leccion = await leccionService.publicarLeccion(req.params.id);

    if (!leccion) {
      return res.status(404).json({ mensaje: "Lección no encontrada" });
    }

    res.json(leccion);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const ocultarLeccion = async (req, res) => {
  try {
    const leccion = await leccionService.ocultarLeccion(req.params.id);

    if (!leccion) {
      return res.status(404).json({ mensaje: "Lección no encontrada" });
    }

    res.json(leccion);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const ordenarLecciones = async (req, res) => {
  try {
    const lecciones = await leccionService.ordenarLecciones(
      req.params.cursoId,
      req.body,
    );
    res.json(lecciones);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

module.exports = {
  crearLeccion,
  editarLeccion,
  eliminarLeccion,
  listarLeccionesPorCurso,
  buscarLeccionPorId,
  publicarLeccion,
  ocultarLeccion,
  ordenarLecciones,
};
