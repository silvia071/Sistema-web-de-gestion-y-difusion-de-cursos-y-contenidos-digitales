const mongoose = require("mongoose");
const Favorito = require("../models/favorito.model");
const Curso = require("../models/curso.model");

const listarFavoritosPorUsuario = async (usuarioId) => {
  return Favorito.find({ usuario: usuarioId })
    .populate({
      path: "curso",
      populate: {
        path: "categoria",
        select: "nombre",
      },
    })
    .sort({ fechaAgregado: -1 });
};

const obtenerIdsCursosFavoritos = async (usuarioId) => {
  const favoritos = await Favorito.find({ usuario: usuarioId }).select("curso");

  return favoritos.map((favorito) => favorito.curso.toString());
};

const agregarFavorito = async (usuarioId, cursoId) => {
  if (!mongoose.Types.ObjectId.isValid(cursoId)) {
    const error = new Error("ID de curso inválido");
    error.statusCode = 400;
    throw error;
  }

  const cursoExiste = await Curso.findById(cursoId);

  if (!cursoExiste) {
    const error = new Error("El curso no existe");
    error.statusCode = 404;
    throw error;
  }

  const favoritoExistente = await Favorito.findOne({
    usuario: usuarioId,
    curso: cursoId,
  });

  if (favoritoExistente) {
    return favoritoExistente;
  }

  const nuevoFavorito = new Favorito({
    usuario: usuarioId,
    curso: cursoId,
  });

  return nuevoFavorito.save();
};

const quitarFavorito = async (usuarioId, cursoId) => {
  if (!mongoose.Types.ObjectId.isValid(cursoId)) {
    const error = new Error("ID de curso inválido");
    error.statusCode = 400;
    throw error;
  }

  const favoritoEliminado = await Favorito.findOneAndDelete({
    usuario: usuarioId,
    curso: cursoId,
  });

  if (!favoritoEliminado) {
    const error = new Error("El curso no estaba en favoritos");
    error.statusCode = 404;
    throw error;
  }

  return favoritoEliminado;
};

const alternarFavorito = async (usuarioId, cursoId) => {
  if (!mongoose.Types.ObjectId.isValid(cursoId)) {
    const error = new Error("ID de curso inválido");
    error.statusCode = 400;
    throw error;
  }

  const favoritoExistente = await Favorito.findOne({
    usuario: usuarioId,
    curso: cursoId,
  });

  if (favoritoExistente) {
    await Favorito.findByIdAndDelete(favoritoExistente._id);

    return {
      esFavorito: false,
      mensaje: "Curso quitado de favoritos",
    };
  }

  const cursoExiste = await Curso.findById(cursoId);

  if (!cursoExiste) {
    const error = new Error("El curso no existe");
    error.statusCode = 404;
    throw error;
  }

  await Favorito.create({
    usuario: usuarioId,
    curso: cursoId,
  });

  return {
    esFavorito: true,
    mensaje: "Curso agregado a favoritos",
  };
};

module.exports = {
  listarFavoritosPorUsuario,
  obtenerIdsCursosFavoritos,
  agregarFavorito,
  quitarFavorito,
  alternarFavorito,
};
