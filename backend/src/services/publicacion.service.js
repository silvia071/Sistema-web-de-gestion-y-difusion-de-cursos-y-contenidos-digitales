const Publicacion = require("../models/publicacion.model");
const Categoria = require("../models/categoria.model");
const EstadoContenido = require("../enums/estadoContenido");

const crearPublicacion = async (datosPublicacion) => {
  if (!datosPublicacion.categoria) {
    throw new Error("La publicación debe tener una categoría");
  }
  const nuevaPublicacion = new Publicacion(datosPublicacion);
  const guardada = await nuevaPublicacion.save();

  // 2. Agregarla a la categoría
  await Categoria.findByIdAndUpdate(guardada.categoria, {
    $push: { publicaciones: guardada._id },
  });

  return guardada;
};

const editarPublicacion = async (id, datosActualizados) => {
  return await Publicacion.findByIdAndUpdate(id, datosActualizados, {
    new: true,
    runValidators: true,
  }).populate("categoria");
};

const eliminarPublicacion = async (id) => {
  return await Publicacion.findByIdAndDelete(id);
};

const listarPublicaciones = async (filtros = {}) => {
  const filtroMongo = {};

  if (filtros.estado) {
    filtroMongo.estado = filtros.estado;
  }

  if (filtros.categoria) {
    const categoria = await Categoria.findOne({
      nombre: { $regex: new RegExp(`^${filtros.categoria}$`, "i") },
    });

    if (!categoria) {
      return [];
    }

    filtroMongo.categoria = categoria._id;
  }

  return await Publicacion.find(filtroMongo).populate("categoria");
};

const buscarPublicacionPorId = async (id) => {
  return await Publicacion.findById(id).populate("categoria");
};

const filtrarPorCategoria = async (nombreCategoria) => {
  const categoria = await Categoria.findOne({
    nombre: { $regex: new RegExp(`^${nombreCategoria}$`, "i") },
  });

  if (!categoria) {
    return [];
  }

  return await Publicacion.find({ categoria: categoria._id }).populate(
    "categoria",
  );
};

const publicarPublicacion = async (id) => {
  return await Publicacion.findByIdAndUpdate(
    id,
    { estado: EstadoContenido.PUBLICADO },
    { new: true, runValidators: true },
  ).populate("categoria");
};

const ocultarPublicacion = async (id) => {
  return await Publicacion.findByIdAndUpdate(
    id,
    { estado: EstadoContenido.OCULTO },
    { new: true, runValidators: true },
  ).populate("categoria");
};

module.exports = {
  crearPublicacion,
  editarPublicacion,
  eliminarPublicacion,
  listarPublicaciones,
  buscarPublicacionPorId,
  filtrarPorCategoria,
  publicarPublicacion,
  ocultarPublicacion,
};
