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

const validarLeccion = (data, esEdicion = false) => {
  const errores = [];
  const { titulo, descripcion, contenido, duracionMinutos, orden, curso } =
    data;

  if (!esEdicion || titulo !== undefined) {
    if (!titulo || titulo.trim() === "") {
      errores.push(
        esEdicion
          ? "El título no puede estar vacío"
          : "El título es obligatorio",
      );
    }
  }

  if (!esEdicion || descripcion !== undefined) {
    if (!descripcion || descripcion.trim() === "") {
      errores.push(
        esEdicion
          ? "La descripción no puede estar vacía"
          : "La descripción es obligatoria",
      );
    }
  }

  if (!esEdicion || contenido !== undefined) {
    if (!contenido || contenido.trim() === "") {
      errores.push(
        esEdicion
          ? "El contenido no puede estar vacío"
          : "El contenido es obligatorio",
      );
    }
  }

  if (!esEdicion || duracionMinutos !== undefined) {
    if (
      duracionMinutos === undefined ||
      duracionMinutos === null ||
      duracionMinutos === ""
    ) {
      errores.push(
        esEdicion
          ? "La duración en minutos no puede estar vacía"
          : "La duración en minutos es obligatoria",
      );
    } else if (
      !Number.isInteger(Number(duracionMinutos)) ||
      Number(duracionMinutos) < 1
    ) {
      errores.push(
        "La duración en minutos debe ser un número entero mayor o igual a 1",
      );
    }
  }

  if (!esEdicion || orden !== undefined) {
    if (orden === undefined || orden === null || orden === "") {
      errores.push(
        esEdicion ? "El orden no puede estar vacío" : "El orden es obligatorio",
      );
    } else if (!Number.isInteger(Number(orden)) || Number(orden) < 1) {
      errores.push("El orden debe ser un número entero mayor o igual a 1");
    }
  }

  if (!esEdicion || curso !== undefined) {
    if (!curso || !esObjectIdValido(curso)) {
      errores.push("ID de curso inválido");
    }
  }

  return errores;
};

const normalizarDatosLeccion = (data) => {
  const datos = { ...data };

  if (datos.titulo !== undefined) {
    datos.titulo = datos.titulo.trim();
  }

  if (datos.descripcion !== undefined) {
    datos.descripcion = datos.descripcion.trim();
  }

  if (datos.contenido !== undefined) {
    datos.contenido = datos.contenido.trim();
  }

  if (datos.duracionMinutos !== undefined) {
    datos.duracionMinutos = Number(datos.duracionMinutos);
  }

  if (datos.orden !== undefined) {
    datos.orden = Number(datos.orden);
  }

  return datos;
};

const crearLeccion = async (req, res) => {
  try {
    const errores = validarLeccion(req.body, false);

    if (errores.length > 0) {
      return res.status(400).json({
        mensaje: "Error de validación",
        errores,
      });
    }

    const datos = normalizarDatosLeccion(req.body);
    const leccion = await leccionService.crearLeccion(datos);

    return res.status(201).json({
      mensaje: "Lección creada correctamente",
      datos: leccion,
    });
  } catch (error) {
    if (esErrorDeNegocioLeccion(error.message)) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const editarLeccion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        mensaje: "Debe enviar datos para actualizar",
      });
    }

    const errores = validarLeccion(req.body, true);

    if (errores.length > 0) {
      return res.status(400).json({
        mensaje: "Error de validación",
        errores,
      });
    }

    const datos = normalizarDatosLeccion(req.body);
    const leccion = await leccionService.editarLeccion(id, datos);

    if (!leccion) {
      return res.status(404).json({
        mensaje: "Lección no encontrada",
      });
    }

    return res.status(200).json({
      mensaje: "Lección actualizada correctamente",
      datos: leccion,
    });
  } catch (error) {
    if (esErrorDeNegocioLeccion(error.message)) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const eliminarLeccion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    const leccion = await leccionService.eliminarLeccion(id);

    if (!leccion) {
      return res.status(404).json({
        mensaje: "Lección no encontrada",
      });
    }

    return res.status(200).json({
      mensaje: "Lección eliminada correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const listarLeccionesPorCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;

    if (!esObjectIdValido(cursoId)) {
      return res.status(400).json({
        mensaje: "ID de curso inválido",
      });
    }

    const esAdmin = req.usuario?.rol === "ADMINISTRADOR";

    const lecciones = esAdmin
      ? await leccionService.listarLeccionesPorCurso(cursoId)
      : await leccionService.listarLeccionesPublicadasPorCurso(cursoId);

    return res.status(200).json({
      mensaje: "Lecciones obtenidas correctamente",
      datos: lecciones,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const buscarLeccionPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    const leccion = await leccionService.buscarLeccionPorId(id);

    if (!leccion) {
      return res.status(404).json({
        mensaje: "Lección no encontrada",
      });
    }

    return res.status(200).json({
      mensaje: "Lección obtenida correctamente",
      datos: leccion,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const publicarLeccion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    const leccion = await leccionService.publicarLeccion(id);

    if (!leccion) {
      return res.status(404).json({
        mensaje: "Lección no encontrada",
      });
    }

    return res.status(200).json({
      mensaje: "Lección publicada correctamente",
      datos: leccion,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const ocultarLeccion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    const leccion = await leccionService.ocultarLeccion(id);

    if (!leccion) {
      return res.status(404).json({
        mensaje: "Lección no encontrada",
      });
    }

    return res.status(200).json({
      mensaje: "Lección ocultada correctamente",
      datos: leccion,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const ordenarLecciones = async (req, res) => {
  try {
    const { cursoId } = req.params;

    if (!esObjectIdValido(cursoId)) {
      return res.status(400).json({
        mensaje: "ID de curso inválido",
      });
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
      return res.status(400).json({
        mensaje: "Error de validación",
        errores,
      });
    }

    const datos = req.body.map((item) => ({
      ...item,
      orden: Number(item.orden),
    }));

    const lecciones = await leccionService.ordenarLecciones(cursoId, datos);

    return res.status(200).json({
      mensaje: "Lecciones ordenadas correctamente",
      datos: lecciones,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
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
