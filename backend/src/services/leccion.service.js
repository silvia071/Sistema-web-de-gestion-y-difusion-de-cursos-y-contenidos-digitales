const Leccion = require("../models/leccion.model");
const Curso = require("../models/curso.model");
const EstadoContenido = require("../enums/estadoContenido");

class LeccionService {
  async crearLeccion(datosLeccion) {
    if (!datosLeccion.curso) {
      throw new Error("La lección debe pertenecer a un curso");
    }

    const cursoExistente = await Curso.findById(datosLeccion.curso);
    if (!cursoExistente) {
      throw new Error("El curso indicado no existe");
    }

    const existeOrden = await Leccion.findOne({
      curso: datosLeccion.curso,
      orden: datosLeccion.orden,
    });

    if (existeOrden) {
      throw new Error("Ya existe una lección con ese orden en el curso");
    }

    const leccion = new Leccion(datosLeccion);
    const leccionGuardada = await leccion.save();

    await Curso.findByIdAndUpdate(leccionGuardada.curso, {
      $addToSet: { lecciones: leccionGuardada._id },
    });

    return await Leccion.findById(leccionGuardada._id).populate("curso");
  }

  async editarLeccion(id, datosActualizados) {
    const leccionOriginal = await Leccion.findById(id);

    if (!leccionOriginal) {
      return null;
    }

    const cursoOriginal = leccionOriginal.curso.toString();
    const cursoNuevo = datosActualizados.curso
      ? datosActualizados.curso.toString()
      : cursoOriginal;

    if (datosActualizados.curso) {
      const cursoExistente = await Curso.findById(cursoNuevo);
      if (!cursoExistente) {
        throw new Error("El nuevo curso indicado no existe");
      }
    }

    const nuevoOrden =
      datosActualizados.orden !== undefined
        ? datosActualizados.orden
        : leccionOriginal.orden;

    const existeOrden = await Leccion.findOne({
      _id: { $ne: id },
      curso: cursoNuevo,
      orden: nuevoOrden,
    });

    if (existeOrden) {
      throw new Error("Ya existe una lección con ese orden en el curso");
    }

    const leccionActualizada = await Leccion.findByIdAndUpdate(
      id,
      datosActualizados,
      {
        new: true,
        runValidators: true,
      },
    );

    if (cursoNuevo !== cursoOriginal) {
      await Curso.findByIdAndUpdate(cursoOriginal, {
        $pull: { lecciones: leccionOriginal._id },
      });

      await Curso.findByIdAndUpdate(cursoNuevo, {
        $addToSet: { lecciones: leccionOriginal._id },
      });
    }

    return await Leccion.findById(leccionActualizada._id).populate("curso");
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
    return await Leccion.find({ curso: cursoId })
      .sort({ orden: 1 })
      .populate("curso");
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
    const ids = leccionesOrdenadas.map((item) => item.id);

    const leccionesExistentes = await Leccion.find({
      _id: { $in: ids },
      curso: cursoId,
    });

    if (leccionesExistentes.length !== leccionesOrdenadas.length) {
      throw new Error(
        "Una o más lecciones no existen o no pertenecen al curso indicado",
      );
    }

    for (const item of leccionesOrdenadas) {
      await Leccion.findByIdAndUpdate(
        item.id,
        { orden: item.orden },
        { new: true, runValidators: true },
      );
    }

    return await Leccion.find({ curso: cursoId })
      .sort({ orden: 1 })
      .populate("curso");
  }
}

module.exports = new LeccionService();
