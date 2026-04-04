const mongoose = require("mongoose");
const cursoService = require("../services/curso.service");
const NivelCurso = require("../enums/nivelCurso");

const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

const esErrorDeNegocioCurso = (mensaje) => {
  return [
    "El curso debe tener una categoría",
    "La categoría indicada no existe",
  ].includes(mensaje);
};

const crearCurso = async (req, res) => {
  try {
    const { titulo, descripcion, precio, duracion, nivel, categoria } =
      req.body;

    const errores = [];

    if (!titulo || titulo.trim() === "") {
      errores.push("El título es obligatorio");
    }

    if (!descripcion || descripcion.trim() === "") {
      errores.push("La descripción es obligatoria");
    }

    if (precio === undefined || precio === null || precio === "") {
      errores.push("El precio es obligatorio");
    } else if (Number(precio) <= 0) {
      errores.push("El precio debe ser mayor a 0");
    }

    if (!duracion || duracion.trim() === "") {
      errores.push("La duración es obligatoria");
    }

    if (!nivel || nivel.trim() === "") {
      errores.push("El nivel es obligatorio");
    } else if (!Object.values(NivelCurso).includes(nivel)) {
      errores.push("El nivel ingresado no es válido");
    }

    if (!categoria || !esObjectIdValido(categoria)) {
      errores.push("La categoría es obligatoria y debe ser un ID válido");
    }

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    const curso = await cursoService.crearCurso(req.body);
    res.status(201).json(curso);
  } catch (error) {
    if (esErrorDeNegocioCurso(error.message)) {
      return res.status(400).json({ mensaje: error.message });
    }

    res.status(500).json({
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

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        mensaje: "Debe enviar datos para actualizar",
      });
    }

    const { titulo, descripcion, precio, duracion, nivel, categoria } =
      req.body;

    const errores = [];

    if (titulo !== undefined && titulo.trim() === "") {
      errores.push("El título no puede estar vacío");
    }

    if (descripcion !== undefined && descripcion.trim() === "") {
      errores.push("La descripción no puede estar vacía");
    }

    if (precio !== undefined && precio !== null && precio !== "") {
      if (Number(precio) <= 0) {
        errores.push("El precio debe ser mayor a 0");
      }
    }

    if (duracion !== undefined && duracion.trim() === "") {
      errores.push("La duración no puede estar vacía");
    }

    if (nivel !== undefined) {
      if (nivel.trim() === "") {
        errores.push("El nivel no puede estar vacío");
      } else if (!Object.values(NivelCurso).includes(nivel)) {
        errores.push("El nivel ingresado no es válido");
      }
    }

    if (categoria !== undefined && !esObjectIdValido(categoria)) {
      errores.push("La categoría debe ser un ID válido");
    }

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    const curso = await cursoService.editarCurso(id, req.body);

    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json(curso);
  } catch (error) {
    if (esErrorDeNegocioCurso(error.message)) {
      return res.status(400).json({ mensaje: error.message });
    }

    res.status(500).json({ mensaje: error.message });
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
    res.status(500).json({ mensaje: error.message });
  }
};

const listarCursos = async (req, res) => {
  try {
    const { categoria, estado } = req.query;

    let filtros = {};

    if (categoria) {
      if (!esObjectIdValido(categoria)) {
        return res.status(400).json({
          mensaje: "ID de categoría inválido",
        });
      }

      filtros.categoria = categoria;
    }

    if (estado) {
      filtros.estado = estado.toUpperCase();
    }

    const cursos = await cursoService.listarCursos(filtros);

    res.json(cursos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
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
    res.status(500).json({ mensaje: error.message });
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
    res.status(500).json({ mensaje: error.message });
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
    res.status(500).json({ mensaje: error.message });
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
