const mongoose = require("mongoose");
const CategoriaService = require("../services/categoria.service");

const getCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaService.listarCategorias();
    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener categorías",
      error: error.message,
    });
  }
};

const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID de categoría inválido" });
    }

    const categoria = await CategoriaService.buscarCategoriaPorId(id);

    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    return res.status(200).json(categoria);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al buscar categoría",
      error: error.message,
    });
  }
};

const createCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre?.trim() || !descripcion?.trim()) {
      return res.status(400).json({
        mensaje: "Nombre y descripción son obligatorios",
      });
    }

    const nuevaCategoria = await CategoriaService.crearCategoria(req.body);

    return res.status(201).json(nuevaCategoria);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "Ya existe una categoría con ese nombre",
      });
    }

    return res.status(500).json({
      mensaje: "Error al crear categoría",
      error: error.message,
    });
  }
};

const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID de categoría inválido" });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        mensaje: "Debe enviar datos para actualizar",
      });
    }

    const categoriaActualizada = await CategoriaService.editarCategoria(
      id,
      req.body,
    );

    if (!categoriaActualizada) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    return res.status(200).json(categoriaActualizada);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "Ya existe una categoría con ese nombre",
      });
    }

    return res.status(500).json({
      mensaje: "Error al actualizar categoría",
      error: error.message,
    });
  }
};

const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID de categoría inválido" });
    }

    const categoriaEliminada = await CategoriaService.eliminarCategoria(id);

    if (!categoriaEliminada) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    return res.status(200).json({
      mensaje: "Categoría eliminada correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar categoría",
      error: error.message,
    });
  }
};

module.exports = {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
