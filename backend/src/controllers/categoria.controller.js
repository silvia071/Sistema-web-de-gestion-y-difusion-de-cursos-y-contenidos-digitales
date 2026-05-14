const mongoose = require("mongoose");
const CategoriaService = require("../services/categoria.service");

const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

const getCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaService.listarCategorias();

    return res.status(200).json({
      mensaje: "Categorías obtenidas correctamente",
      datos: categorias,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID de categoría inválido",
      });
    }

    const categoria = await CategoriaService.buscarCategoriaPorId(id);

    if (!categoria) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada",
      });
    }

    return res.status(200).json({
      mensaje: "Categoría obtenida correctamente",
      datos: categoria,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
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

    return res.status(201).json({
      mensaje: "Categoría creada correctamente",
      datos: nuevaCategoria,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "Ya existe una categoría con ese nombre",
      });
    }

    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID de categoría inválido",
      });
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
      return res.status(404).json({
        mensaje: "Categoría no encontrada",
      });
    }

    return res.status(200).json({
      mensaje: "Categoría actualizada correctamente",
      datos: categoriaActualizada,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "Ya existe una categoría con ese nombre",
      });
    }

    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID de categoría inválido",
      });
    }

    const categoriaEliminada = await CategoriaService.eliminarCategoria(id);

    if (!categoriaEliminada) {
      return res.status(404).json({
        mensaje: "Categoría no encontrada",
      });
    }

    return res.status(200).json({
      mensaje: "Categoría eliminada correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
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
