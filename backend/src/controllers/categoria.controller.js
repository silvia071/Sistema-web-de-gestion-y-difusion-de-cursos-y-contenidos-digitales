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
    const categoria = await CategoriaService.buscarCategoriaPorId(
      req.params.id,
    );

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
    const nuevaCategoria = await CategoriaService.crearCategoria(req.body);
    return res.status(201).json(nuevaCategoria);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al crear categoría",
      error: error.message,
    });
  }
};

const updateCategoria = async (req, res) => {
  try {
    const categoriaActualizada = await CategoriaService.editarCategoria(
      req.params.id,
      req.body,
    );

    if (!categoriaActualizada) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    return res.status(200).json(categoriaActualizada);
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al actualizar categoría",
      error: error.message,
    });
  }
};

const deleteCategoria = async (req, res) => {
  try {
    const categoriaEliminada = await CategoriaService.eliminarCategoria(
      req.params.id,
    );

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
