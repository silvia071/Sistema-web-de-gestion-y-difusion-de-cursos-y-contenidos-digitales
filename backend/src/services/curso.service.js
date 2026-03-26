const Curso = require("../models/curso.model");
const EstadoContenido = require("../enums/estadoContenido");

class CursoService {
  async crearCurso(datosCurso) {
    const curso = new Curso(datosCurso);
    return await curso.save();
  }

  async editarCurso(id, datosActualizados) {
    return await Curso.findByIdAndUpdate(id, datosActualizados, {
      new: true,
      runValidators: true,
    })
      .populate("categoria")
      .populate({
        path: "lecciones",
        options: { sort: { orden: 1 } },
      });
  }

  async eliminarCurso(id) {
    return await Curso.findByIdAndDelete(id);
  }

  async listarCursos() {
    return await Curso.find()
      .populate("categoria")
      .populate({
        path: "lecciones",
        options: { sort: { orden: 1 } },
      });
  }

  async buscarCursoPorId(id) {
    return await Curso.findById(id)
      .populate("categoria")
      .populate({
        path: "lecciones",
        options: { sort: { orden: 1 } },
      });
  }

  async filtrarPorCategoria(categoriaId) {
    return await Curso.find({ categoria: categoriaId })
      .populate("categoria")
      .populate({
        path: "lecciones",
        options: { sort: { orden: 1 } },
      });
  }

  async publicarCurso(id) {
    return await Curso.findByIdAndUpdate(
      id,
      { estado: EstadoContenido.PUBLICADO },
      { new: true, runValidators: true },
    )
      .populate("categoria")
      .populate({
        path: "lecciones",
        options: { sort: { orden: 1 } },
      });
  }

  async ocultarCurso(id) {
    return await Curso.findByIdAndUpdate(
      id,
      { estado: EstadoContenido.OCULTO },
      { new: true, runValidators: true },
    )
      .populate("categoria")
      .populate({
        path: "lecciones",
        options: { sort: { orden: 1 } },
      });
  }
}

module.exports = new CursoService();
