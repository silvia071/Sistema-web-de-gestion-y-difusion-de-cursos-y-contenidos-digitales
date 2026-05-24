const reseniaService = require("../services/resenia.service");

const listarPorCurso = async (req, res, next) => {
  try {
    const { cursoId } = req.params;

    const resultado = await reseniaService.listarPorCurso(cursoId);

    res.json({
      mensaje: "Reseñas obtenidas correctamente",
      resenias: resultado.resenias,
      resumen: resultado.resumen,
    });
  } catch (error) {
    next(error);
  }
};

const obtenerMiResenia = async (req, res, next) => {
  try {
    const usuarioId = req.usuario._id;
    const { cursoId } = req.params;

    const resenia = await reseniaService.obtenerMiResenia(usuarioId, cursoId);

    res.json({
      mensaje: "Reseña del usuario obtenida correctamente",
      resenia,
    });
  } catch (error) {
    next(error);
  }
};

const crearResenia = async (req, res, next) => {
  try {
    const usuarioId = req.usuario._id;
    const { cursoId, puntaje, comentario } = req.body;

    const resenia = await reseniaService.crearResenia({
      usuarioId,
      cursoId,
      puntaje,
      comentario,
    });

    res.status(201).json({
      mensaje: "Reseña creada correctamente",
      resenia,
    });
  } catch (error) {
    next(error);
  }
};

const editarResenia = async (req, res, next) => {
  try {
    const usuarioId = req.usuario._id;
    const { id } = req.params;
    const { puntaje, comentario } = req.body;

    const resenia = await reseniaService.editarResenia({
      usuarioId,
      reseniaId: id,
      puntaje,
      comentario,
    });

    res.json({
      mensaje: "Reseña actualizada correctamente",
      resenia,
    });
  } catch (error) {
    next(error);
  }
};

const eliminarResenia = async (req, res, next) => {
  try {
    const usuarioId = req.usuario._id;
    const { id } = req.params;

    await reseniaService.eliminarResenia(usuarioId, id);

    res.json({
      mensaje: "Reseña eliminada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarPorCurso,
  obtenerMiResenia,
  crearResenia,
  editarResenia,
  eliminarResenia,
};
