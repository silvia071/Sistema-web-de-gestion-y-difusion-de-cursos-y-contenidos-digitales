const Publicacion = require("../models/publicacion.model");

const getPublicaciones = async (req, res) => {
  try {
    const { categoria, estado } = req.query;
    const filtro = {};

    if (categoria) {
      filtro.categoria = categoria;
    }

    if (estado) {
      filtro.estado = estado.trim().toUpperCase();
    }

    console.log("FILTRO:", filtro);

    const publicaciones = await Publicacion.find(filtro).populate("categoria");

    return res.status(200).json(publicaciones);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener publicaciones",
      error: error.message,
    });
  }
};

const getPublicacionById = async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id).populate(
      "categoria",
    );

    if (!publicacion) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }

    return res.status(200).json(publicacion);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al buscar publicación",
      error: error.message,
    });
  }
};

const createPublicacion = async (req, res) => {
  try {
    const nuevaPublicacion = new Publicacion(req.body);
    const guardada = await nuevaPublicacion.save();

    return res.status(201).json(guardada);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear publicación",
      error: error.message,
    });
  }
};

const updatePublicacion = async (req, res) => {
  try {
    const actualizada = await Publicacion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!actualizada) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }

    return res.status(200).json(actualizada);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar publicación",
      error: error.message,
    });
  }
};

const deletePublicacion = async (req, res) => {
  try {
    const eliminada = await Publicacion.findByIdAndDelete(req.params.id);

    if (!eliminada) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }

    return res.status(200).json({
      mensaje: "Publicación eliminada correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar publicación",
      error: error.message,
    });
  }
};

module.exports = {
  getPublicaciones,
  getPublicacionById,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
};
