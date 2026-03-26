const cursoService = require("../services/curso.service");

const crearCurso = async (req, res) => {
  try {
    const curso = await cursoService.crearCurso(req.body);
    res.status(201).json(curso);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const editarCurso = async (req, res) => {
  try {
    const curso = await cursoService.editarCurso(req.params.id, req.body);

    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json(curso);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const eliminarCurso = async (req, res) => {
  try {
    const curso = await cursoService.eliminarCurso(req.params.id);

    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json({ mensaje: "Curso eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
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
    res.status(500).json({ mensaje: error.message });
  }
};

const buscarCursoPorId = async (req, res) => {
  try {
    const curso = await cursoService.buscarCursoPorId(req.params.id);

    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json(curso);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const publicarCurso = async (req, res) => {
  try {
    const curso = await cursoService.publicarCurso(req.params.id);

    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json(curso);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const ocultarCurso = async (req, res) => {
  try {
    const curso = await cursoService.ocultarCurso(req.params.id);

    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json(curso);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
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
