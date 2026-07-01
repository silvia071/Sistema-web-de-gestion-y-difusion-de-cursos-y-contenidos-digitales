const mongoose = require("mongoose");
const metodoPagoService = require("../services/metodoPago.service");

const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

const crearMetodoPago = async (req, res) => {
  try {
    const nombre = String(req.body.nombre || "").trim();
    const tipo = String(req.body.tipo || "")
      .trim()
      .toUpperCase();
    const descripcion = String(req.body.descripcion || "").trim();
    const alias = String(req.body.alias || "").trim();
    const cbu = String(req.body.cbu || "").trim();
    const titular = String(req.body.titular || "").trim();
    const activo = req.body.activo ?? true;

    if (!nombre) {
      return res.status(400).json({
        mensaje: "El nombre del método de pago es obligatorio",
      });
    }

    if (nombre.length < 3 || nombre.length > 60) {
      return res.status(400).json({
        mensaje: "El nombre debe tener entre 3 y 60 caracteres",
      });
    }

    if (!tipo) {
      return res.status(400).json({
        mensaje: "El tipo de método de pago es obligatorio",
      });
    }

    if (descripcion.length > 200) {
      return res.status(400).json({
        mensaje: "La descripción no puede superar los 200 caracteres",
      });
    }

    if (alias.length > 50) {
      return res.status(400).json({
        mensaje: "El alias no puede superar los 50 caracteres",
      });
    }

    if (cbu && !/^\d{22}$/.test(cbu)) {
      return res.status(400).json({
        mensaje: "El CBU debe contener exactamente 22 números",
      });
    }

    if (titular.length > 80) {
      return res.status(400).json({
        mensaje: "El titular no puede superar los 80 caracteres",
      });
    }

    const metodo = await metodoPagoService.crearMetodoPago({
      nombre,
      tipo,
      descripcion,
      alias,
      cbu,
      titular,
      activo: Boolean(activo),
    });

    return res.status(201).json({
      mensaje: "Método de pago creado correctamente",
      datos: metodo,
    });
  } catch (error) {
    console.error("Error creando método de pago:", error);

    return res.status(400).json({
      mensaje: error.message || "No se pudo crear el método de pago",
    });
  }
};

const listarMetodosPago = async (req, res) => {
  try {
    const metodos = await metodoPagoService.listarMetodosPago();

    return res.status(200).json({
      mensaje: "Métodos de pago obtenidos correctamente",
      datos: metodos,
    });
  } catch (error) {
    console.error("Error listando métodos de pago:", error);

    return res.status(500).json({
      mensaje: "Error al listar métodos de pago",
    });
  }
};

const actualizarMetodoPago = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    const nombre = String(req.body.nombre || "").trim();
    const tipo = String(req.body.tipo || "")
      .trim()
      .toUpperCase();

    if (!nombre) {
      return res.status(400).json({
        mensaje: "El nombre del método de pago es obligatorio",
      });
    }

    if (!tipo) {
      return res.status(400).json({
        mensaje: "El tipo del método de pago es obligatorio",
      });
    }

    const metodo = await metodoPagoService.actualizarMetodoPago(id, {
      nombre,
      tipo,
      descripcion: req.body.descripcion,
      alias: req.body.alias,
      cbu: req.body.cbu,
      titular: req.body.titular,
      activo: req.body.activo,
    });

    return res.status(200).json({
      mensaje: "Método de pago actualizado correctamente",
      datos: metodo,
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: error.message,
    });
  }
};

const cambiarEstadoMetodoPago = async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    if (typeof activo !== "boolean") {
      return res.status(400).json({
        mensaje: "El estado activo debe ser verdadero o falso",
      });
    }

    const metodo = await metodoPagoService.cambiarEstadoMetodoPago(id, activo);

    return res.status(200).json({
      mensaje: activo
        ? "Método de pago activado correctamente"
        : "Método de pago desactivado correctamente",
      datos: metodo,
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: error.message,
    });
  }
};

const buscarMetodoPagoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const metodo = await metodoPagoService.buscarMetodoPagoPorId(id);

    if (!metodo) {
      return res.status(404).json({ mensaje: "Método de pago no encontrado" });
    }

    res.json(metodo);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar método de pago",
    });
  }
};

const eliminarMetodoPago = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({
        mensaje: "ID inválido",
      });
    }

    const metodo = await metodoPagoService.eliminarMetodoPago(id);

    return res.status(200).json({
      mensaje: "Método de pago eliminado correctamente",
      datos: metodo,
    });
  } catch (error) {
    console.error("Error eliminando método de pago:", error);

    const metodoUtilizado = error.message.includes("ya fue utilizado");

    return res.status(metodoUtilizado ? 409 : 400).json({
      mensaje: error.message || "No se pudo eliminar el método de pago",
    });
  }
};

const listarTodosMetodosPago = async (req, res) => {
  try {
    const metodos = await metodoPagoService.listarTodosMetodosPago();

    return res.status(200).json({
      mensaje: "Métodos de pago obtenidos correctamente",
      datos: metodos,
    });
  } catch (error) {
    console.error("Error listando todos los métodos de pago:", error);

    return res.status(500).json({
      mensaje: "Error al listar los métodos de pago",
    });
  }
};

module.exports = {
  crearMetodoPago,
  listarMetodosPago,
  listarTodosMetodosPago,
  buscarMetodoPagoPorId,
  eliminarMetodoPago,
  actualizarMetodoPago,
  cambiarEstadoMetodoPago,
};
