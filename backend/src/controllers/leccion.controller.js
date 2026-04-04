const mongoose = require("mongoose");
const leccionService = require("../services/leccion.service");

const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

const esErrorDeNegocioLeccion = (mensaje) => {
  return [
    "La lección debe pertenecer a un curso",
    "El curso indicado no existe",
    "El nuevo curso indicado no existe",
  ].includes(mensaje);
};

const crearLeccion = async (req, res) => {
  try {
    const { titulo, descripcion, contenido, duracionMinutos, orden, curso } =
      req.body;

    const errores = [];

    if (!titulo || titulo.trim() === "") {
      errores.push("El título es obligatorio");
    }

    if (!descripcion || descripcion.trim() === "") {
      errores.push("La descripción es obligatoria");
    }

    if (!contenido || contenido.trim() === "") {
      errores.push("El contenido es obligatorio");
    }

    if (
      duracionMinutos === undefined ||
      duracionMinutos === null ||
      duracionMinutos === ""
    ) {
      errores.push("La duración en minutos es obligatoria");
    } else if (
      !Number.isInteger(Number(duracionMinutos)) ||
      Number(duracionMinutos) < 1
    ) {
      errores.push(
        "La duración en minutos debe ser un número entero mayor o igual a 1",
      );
    }

    if (orden === undefined || orden === null || orden === "") {
      errores.push("El orden es obligatorio");
    } else if (!Number.isInteger(Number(orden)) || Number(orden) < 1) {
      errores.push("El orden debe ser un número entero mayor o igual a 1");
    }

    if (!curso || !esObjectIdValido(curso)) {
      errores.push("ID de curso inválido");
    }

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    const leccion = await leccionService.crearLeccion(req.body);
    res.status(201).json(leccion);
  } catch (error) {
    if (esErrorDeNegocioLeccion(error.message)) {
      return res.status(400).json({ mensaje: error.message });
    }

    res.status(500).json({ mensaje: error.message });
  }
};

const editarLeccion = async (req, res) => {
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

    const { titulo, descripcion, contenido, duracionMinutos, orden, curso } =
      req.body;

    const errores = [];

    if (titulo !== undefined && titulo.trim() === "") {
      errores.push("El título no puede estar vacío");
    }

    if (descripcion !== undefined && descripcion.trim() === "") {
      errores.push("La descripción no puede estar vacía");
    }

    if (contenido !== undefined && contenido.trim() === "") {
      errores.push("El contenido no puede estar vacío");
    }

    if (duracionMinutos !== undefined) {
      if (duracionMinutos === null || duracionMinutos === "") {
        errores.push("La duración en minutos no puede estar vacía");
      } else if (
        !Number.isInteger(Number(duracionMinutos)) ||
        Number(duracionMinutos) < 1
      ) {
        errores.push(
          "La duración en minutos debe ser un número entero mayor o igual a 1",
        );
      }
    }

    if (orden !== undefined) {
      if (orden === null || orden === "") {
        errores.push("El orden no puede estar vacío");
      } else if (!Number.isInteger(Number(orden)) || Number(orden) < 1) {
        errores.push("El orden debe ser un número entero mayor o igual a 1");
      }
    }

    if (curso !== undefined && !esObjectIdValido(curso)) {
      errores.push("ID de curso inválido");
    }

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    const leccion = await leccionService.editarLeccion(id, req.body);

    if (!leccion) {
      return res.status(404).json({ mensaje: "Lección no encontrada" });
    }

    res.json(leccion);
  } catch (error) {
    if (esErrorDeNegocioLeccion(error.message)) {
      return res.status(400).json({ mensaje: error.message });
    }

    res.status(500).json({ mensaje: error.message });
  }
};

const eliminarLeccion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const leccion = await leccionService.eliminarLeccion(id);

    if (!leccion) {
      return res.status(404).json({ mensaje: "Lección no encontrada" });
    }

    res.json({ mensaje: "Lección eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const listarLeccionesPorCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;

    if (!esObjectIdValido(cursoId)) {
      return res.status(400).json({ mensaje: "ID de curso inválido" });
    }

    const lecciones = await leccionService.listarLeccionesPorCurso(cursoId);
    res.json(lecciones);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const buscarLeccionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const leccion = await leccionService.buscarLeccionPorId(id);

    if (!leccion) {
      return res.status(404).json({ mensaje: "Lección no encontrada" });
    }

    res.json(leccion);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const publicarLeccion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const leccion = await leccionService.publicarLeccion(id);

    if (!leccion) {
      return res.status(404).json({ mensaje: "Lección no encontrada" });
    }

    res.json(leccion);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const ocultarLeccion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const leccion = await leccionService.ocultarLeccion(id);

    if (!leccion) {
      return res.status(404).json({ mensaje: "Lección no encontrada" });
    }

    res.json(leccion);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const ordenarLecciones = async (req, res) => {
  try {
    const { cursoId } = req.params;

    if (!esObjectIdValido(cursoId)) {
      return res.status(400).json({ mensaje: "ID de curso inválido" });
    }

    if (!Array.isArray(req.body) || req.body.length === 0) {
      return res.status(400).json({
        mensaje: "Debe enviar un arreglo de lecciones para ordenar",
      });
    }

    const errores = [];

    req.body.forEach((item, index) => {
      if (!item.id || !esObjectIdValido(item.id)) {
        errores.push(`El id de la lección en la posición ${index} es inválido`);
      }

      if (
        item.orden === undefined ||
        item.orden === null ||
        item.orden === "" ||
        !Number.isInteger(Number(item.orden)) ||
        Number(item.orden) < 1
      ) {
        errores.push(
          `El orden de la lección en la posición ${index} debe ser un número entero mayor o igual a 1`,
        );
      }
    });

    const ordenes = req.body.map((item) => Number(item.orden));
    const ordenesUnicos = new Set(ordenes);

    if (ordenes.length !== ordenesUnicos.size) {
      errores.push("No puede haber órdenes repetidos");
    }

    if (errores.length > 0) {
      return res.status(400).json({ errores });
    }

    const lecciones = await leccionService.ordenarLecciones(cursoId, req.body);
    res.json(lecciones);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = {
  crearLeccion,
  editarLeccion,
  eliminarLeccion,
  listarLeccionesPorCurso,
  buscarLeccionPorId,
  publicarLeccion,
  ocultarLeccion,
  ordenarLecciones,
};
