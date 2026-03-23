const Publicacion = require("../models/publicacion.model");

const getPublicaciones = async (req, res) => {
  try {
    const filtro = {};

    if (req.query.categoria) {
      filtro.categoria = req.query.categoria;
    }

    const publicaciones = await Publicacion.find(filtro).populate("categoria");
    res.status(200).json(publicaciones);
  } catch (error) {
    res.status(500).json({
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

    res.status(200).json(publicacion);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar publicación",
      error: error.message,
    });
  }
};

const createPublicacion = async (req, res) => {
  try {
    const nuevaPublicacion = new Publicacion(req.body);
    const publicacionGuardada = await nuevaPublicacion.save();
    res.status(201).json(publicacionGuardada);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear publicación",
      error: error.message,
    });
  }
};

const updatePublicacion = async (req, res) => {
  try {
    const publicacionActualizada = await Publicacion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!publicacionActualizada) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }

    res.status(200).json(publicacionActualizada);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar publicación",
      error: error.message,
    });
  }
};

const deletePublicacion = async (req, res) => {
  try {
    console.log("ENTRÓ AL DELETE");
    console.log("ID recibido para borrar:", req.params.id);

    const publicacionEliminada = await Publicacion.findByIdAndDelete(
      req.params.id,
    );

    if (!publicacionEliminada) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }

    res.status(200).json({ mensaje: "Publicación eliminada correctamente" });
  } catch (error) {
    console.error("ERROR DELETE:", error);
    res.status(500).json({
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
