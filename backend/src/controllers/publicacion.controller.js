const PublicacionService = require("../services/publicacion.service");

const getPublicaciones = async (req, res) => {
  try {
    const { categoria, estado } = req.query;

    const filtros = {};

    if (categoria) {
      filtros.categoria = categoria;
    }

    if (estado) {
      filtros.estado = estado.trim().toUpperCase();
    }

    const publicaciones = await PublicacionService.listarPublicaciones(filtros);

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
    const publicacion = await PublicacionService.buscarPublicacionPorId(
      req.params.id,
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
    const nuevaPublicacion = await PublicacionService.crearPublicacion(
      req.body,
    );

    return res.status(201).json(nuevaPublicacion);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear publicación",
      error: error.message,
    });
  }
};

const updatePublicacion = async (req, res) => {
  try {
    const actualizada = await PublicacionService.editarPublicacion(
      req.params.id,
      req.body,
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
    const eliminada = await PublicacionService.eliminarPublicacion(
      req.params.id,
    );

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

const publicarPublicacion = async (req, res) => {
  try {
    const publicada = await PublicacionService.publicarPublicacion(
      req.params.id,
    );

    if (!publicada) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }

    return res.status(200).json(publicada);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al publicar publicación",
      error: error.message,
    });
  }
};

const ocultarPublicacion = async (req, res) => {
  try {
    const oculta = await PublicacionService.ocultarPublicacion(req.params.id);

    if (!oculta) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }

    return res.status(200).json(oculta);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al ocultar publicación",
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
  publicarPublicacion,
  ocultarPublicacion,
};
