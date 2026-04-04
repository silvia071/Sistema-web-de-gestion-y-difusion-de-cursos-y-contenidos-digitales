const Categoria = require("../models/categoria.model");

const crearCategoria = async (datosCategoria) => {
  const nuevaCategoria = new Categoria(datosCategoria);
  return await nuevaCategoria.save();
};

const editarCategoria = async (id, datosActualizados) => {
  return await Categoria.findByIdAndUpdate(id, datosActualizados, {
    new: true,
    runValidators: true,
  });
};

const eliminarCategoria = async (id) => {
  return await Categoria.findByIdAndDelete(id);
};

const listarCategorias = async () => {
  return await Categoria.find();
};

const buscarCategoriaPorId = async (id) => {
  return await Categoria.findById(id);
};

module.exports = {
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
  listarCategorias,
  buscarCategoriaPorId,
};
