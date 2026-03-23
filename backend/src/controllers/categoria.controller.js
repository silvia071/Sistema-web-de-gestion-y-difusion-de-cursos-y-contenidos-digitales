const Categoria = require("../models/categoria.model");

const getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.find();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener categorías" });
  }
};

const getCategoriaById = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);

    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar categoría" });
  }
};

const createCategoria = async (req, res) => {
  try {
    const nuevaCategoria = new Categoria(req.body);
    const categoriaGuardada = await nuevaCategoria.save();
    res.status(201).json(categoriaGuardada);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear categoría", error: error.message });
  }
};

const updateCategoria = async (req, res) => {
  try {
    const categoriaActualizada = await Categoria.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!categoriaActualizada) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.status(200).json(categoriaActualizada);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar categoría" });
  }
};

const deleteCategoria = async (req, res) => {
  try {
    const categoriaEliminada = await Categoria.findByIdAndDelete(req.params.id);

    if (!categoriaEliminada) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    res.status(200).json({ mensaje: "Categoría eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar categoría" });
  }
};

module.exports = {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
};
