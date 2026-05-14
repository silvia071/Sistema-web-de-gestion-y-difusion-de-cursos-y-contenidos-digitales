const mongoose = require("mongoose");
const service = require("../services/datosFacturacion.service");

const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

const esAdmin = (req) => {
  return req.usuario?.rol === "ADMINISTRADOR";
};

const perteneceAlUsuario = (dato, usuarioId) => {
  const idUsuarioDato = dato.usuario?._id || dato.usuario;

  return idUsuarioDato?.toString() === usuarioId?.toString();
};

const crearDatosFacturacion = async (req, res) => {
  try {
    const datosFacturacion = {
      ...req.body,
      usuario: req.usuario._id,
    };

    const datos = await service.crearDatosFacturacion(datosFacturacion);

    return res.status(201).json({
      mensaje: "Datos de facturación creados correctamente",
      datos,
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error al crear los datos de facturación",
      error: error.message,
    });
  }
};

const obtenerMisDatosFacturacion = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    const dato = await service.buscarPorUsuario(usuarioId);

    if (!dato) {
      return res.status(200).json({
        mensaje: "El usuario no tiene datos de facturación cargados",
        datos: null,
      });
    }

    return res.status(200).json({
      mensaje: "Datos de facturación obtenidos correctamente",
      datos: dato,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener tus datos de facturación",
      error: error.message,
    });
  }
};

const actualizarMisDatosFacturacion = async (req, res) => {
  try {
    const usuarioId = req.usuario._id;

    const datoExistente = await service.buscarPorUsuario(usuarioId);

    const datosLimpios = {
      ...req.body,
    };

    delete datosLimpios.usuario;
    delete datosLimpios._id;
    delete datosLimpios.createdAt;
    delete datosLimpios.updatedAt;

    if (!datoExistente) {
      const datos = await service.crearDatosFacturacion({
        ...datosLimpios,
        usuario: usuarioId,
      });

      return res.status(201).json({
        mensaje: "Datos de facturación creados correctamente",
        datos,
      });
    }

    const datos = await service.actualizarDatos(
      datoExistente._id,
      datosLimpios,
    );

    return res.status(200).json({
      mensaje: "Datos de facturación actualizados correctamente",
      datos,
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error al guardar tus datos de facturación",
      error: error.message,
    });
  }
};

const listarDatosFacturacion = async (req, res) => {
  try {
    const datos = await service.listarDatosFacturacion();

    return res.status(200).json({
      mensaje: "Datos de facturación obtenidos correctamente",
      datos,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al listar los datos de facturación",
      error: error.message,
    });
  }
};

const buscarDatosFacturacion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    const dato = await service.buscarPorId(id);

    if (!dato) {
      return res.status(404).json({
        mensaje: "Datos de facturación no encontrados",
      });
    }

    if (!esAdmin(req) && !perteneceAlUsuario(dato, req.usuario._id)) {
      return res.status(403).json({
        mensaje: "No tenés permiso para ver estos datos de facturación",
      });
    }

    return res.status(200).json({
      mensaje: "Datos de facturación obtenidos correctamente",
      datos: dato,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al buscar los datos de facturación",
      error: error.message,
    });
  }
};

const actualizarDatosFacturacion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    const datoExistente = await service.buscarPorId(id);

    if (!datoExistente) {
      return res.status(404).json({
        mensaje: "Datos de facturación no encontrados",
      });
    }

    if (!esAdmin(req) && !perteneceAlUsuario(datoExistente, req.usuario._id)) {
      return res.status(403).json({
        mensaje: "No tenés permiso para modificar estos datos de facturación",
      });
    }

    const datosActualizados = {
      ...req.body,
    };

    delete datosActualizados.usuario;
    delete datosActualizados._id;
    delete datosActualizados.createdAt;
    delete datosActualizados.updatedAt;

    const dato = await service.actualizarDatos(id, datosActualizados);

    return res.status(200).json({
      mensaje: "Datos de facturación actualizados correctamente",
      datos: dato,
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error al actualizar los datos de facturación",
      error: error.message,
    });
  }
};

const eliminarDatosFacturacion = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    const datoExistente = await service.buscarPorId(id);

    if (!datoExistente) {
      return res.status(404).json({
        mensaje: "Datos de facturación no encontrados",
      });
    }

    if (!esAdmin(req) && !perteneceAlUsuario(datoExistente, req.usuario._id)) {
      return res.status(403).json({
        mensaje: "No tenés permiso para eliminar estos datos de facturación",
      });
    }

    await service.eliminarDatos(id);

    return res.status(200).json({
      mensaje: "Datos de facturación eliminados correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al eliminar los datos de facturación",
      error: error.message,
    });
  }
};

module.exports = {
  crearDatosFacturacion,
  obtenerMisDatosFacturacion,
  actualizarMisDatosFacturacion,
  listarDatosFacturacion,
  buscarDatosFacturacion,
  actualizarDatosFacturacion,
  eliminarDatosFacturacion,
};
