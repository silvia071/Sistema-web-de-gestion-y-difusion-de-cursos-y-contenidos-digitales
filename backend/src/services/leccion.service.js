const Leccion = require("../models/leccion.model");
const Curso = require("../models/curso.model");
const EstadoContenido = require("../enums/estadoContenido");

class LeccionService {
  async crearLeccion(datosLeccion) {
    const leccion = new Leccion(datosLeccion);
    const leccionGuardada = await leccion.save();

    await Curso.findByIdAndUpdate(leccionGuardada.curso, {
      $push: { lecciones: leccionGuardada._id },
    });

    return await Leccion.findById(leccionGuardada._id).populate("curso");
  }

  async editarLeccion(id, datosActualizados) {
    return await Leccion.findByIdAndUpdate(id, datosActualizados, {
      new: true,
      runValidators: true,
    }).populate("curso");
  }

  async eliminarLeccion(id) {
    const leccion = await Leccion.findById(id);
    if (!leccion) return null;

    await Curso.findByIdAndUpdate(leccion.curso, {
      $pull: { lecciones: leccion._id },
    });

    return await Leccion.findByIdAndDelete(id);
  }

  async listarLeccionesPorCurso(cursoId) {
    return await Leccion.find({ curso: cursoId }).sort({ orden: 1 });
  }

  async buscarLeccionPorId(id) {
    return await Leccion.findById(id).populate("curso");
  }

  async publicarLeccion(id) {
    return await Leccion.findByIdAndUpdate(
      id,
      { estado: EstadoContenido.PUBLICADO },
      { new: true, runValidators: true },
    ).populate("curso");
  }

  async ocultarLeccion(id) {
    return await Leccion.findByIdAndUpdate(
      id,
      { estado: EstadoContenido.OCULTO },
      { new: true, runValidators: true },
    ).populate("curso");
  }

  async ordenarLecciones(cursoId, leccionesOrdenadas) {
    for (const item of leccionesOrdenadas) {
      await Leccion.findOneAndUpdate(
        { _id: item.idLeccion, curso: cursoId },
        { orden: item.orden },
        { new: true, runValidators: true },
      );
    }

    return await Leccion.find({ curso: cursoId }).sort({ orden: 1 });
  }
}

module.exports = new LeccionService();
