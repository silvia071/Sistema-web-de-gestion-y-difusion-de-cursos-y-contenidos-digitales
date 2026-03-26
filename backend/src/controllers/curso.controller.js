const mongoose = require("mongoose");
const cursoService = require("../services/curso.service");

const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

const crearCurso = async (req, res) => {
  try {
    const { titulo, precio } = req.body;

    if (!titulo) {
      return res.status(400).json({
        mensaje: "El título es obligatorio",
      });
    }

    if (!precio) {
      return res.status(400).json({
        mensaje: "El precio es obligatorio",
      });
    }

    const curso = await cursoService.crearCurso(req.body);

    res.status(201).json(curso);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

const editarCurso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const curso = await cursoService.editarCurso(id, req.body);

    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json(curso);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al editar el curso" });
  }
};

const eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const curso = await cursoService.eliminarCurso(id);

    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json({ mensaje: "Curso eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el curso" });
  }
};

const listarCursos = async (req, res) => {
  try {
    const { categoria } = req.query;

    const cursos = categoria
      ? await cursoService.filtrarPorCategoria(categoria)
      : await cursoService.listarCursos();

    res.json(cursos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar cursos" });
  }
};

const buscarCursoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const curso = await cursoService.buscarCursoPorId(id);

    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json(curso);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar el curso" });
  }
};

const publicarCurso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const curso = await cursoService.publicarCurso(id);

    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json(curso);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al publicar el curso" });
  }
};

const ocultarCurso = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const curso = await cursoService.ocultarCurso(id);

    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json(curso);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al ocultar el curso" });
  }
};

module.exports = {
  crearCurso,
  editarCurso,
  eliminarCurso,
  listarCursos,
  buscarCursoPorId,
  publicarCurso,
  ocultarCurso,
};
