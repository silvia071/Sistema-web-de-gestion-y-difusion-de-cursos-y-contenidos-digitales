const favoritoService = require("../services/favorito.service");

const listarMisFavoritos = async (req, res, next) => {
  try {
    const usuarioId = req.usuario._id;

    const favoritos =
      await favoritoService.listarFavoritosPorUsuario(usuarioId);

    res.json({
      mensaje: "Favoritos obtenidos correctamente",
      favoritos,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerIdsMisFavoritos = async (req, res, next) => {
  try {
    const usuarioId = req.usuario._id;

    const cursosFavoritosIds =
      await favoritoService.obtenerIdsCursosFavoritos(usuarioId);

    res.json({
      mensaje: "IDs de favoritos obtenidos correctamente",
      cursosFavoritosIds,
    });
  } catch (error) {
    next(error);
  }
};

const agregarFavorito = async (req, res, next) => {
  try {
    const usuarioId = req.usuario._id;
    const { cursoId } = req.body;

    const favorito = await favoritoService.agregarFavorito(usuarioId, cursoId);

    res.status(201).json({
      mensaje: "Curso agregado a favoritos",
      favorito,
    });
  } catch (error) {
    next(error);
  }
};

const quitarFavorito = async (req, res, next) => {
  try {
    const usuarioId = req.usuario._id;
    const { cursoId } = req.params;

    await favoritoService.quitarFavorito(usuarioId, cursoId);

    res.json({
      mensaje: "Curso quitado de favoritos",
    });
  } catch (error) {
    next(error);
  }
};

const alternarFavorito = async (req, res, next) => {
  try {
    const usuarioId = req.usuario._id;
    const { cursoId } = req.params;

    const resultado = await favoritoService.alternarFavorito(
      usuarioId,
      cursoId,
    );

    res.json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarMisFavoritos,
  obtenerIdsMisFavoritos,
  agregarFavorito,
  quitarFavorito,
  alternarFavorito,
};
