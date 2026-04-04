const mongoose = require("mongoose");
const metodoPagoService = require("../services/metodoPago.service");

const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

// ✅ Crear método de pago
const crearMetodoPago = async (req, res) => {
  try {
    const { tipo } = req.body;

    if (!tipo) {
      return res.status(400).json({
        mensaje: "El tipo de método de pago es obligatorio",
      });
    }

    const metodo = await metodoPagoService.crearMetodoPago(req.body);

    res.status(201).json(metodo);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message,
    });
  }
};

// ✅ Listar todos
const listarMetodosPago = async (req, res) => {
  try {
    const metodos = await metodoPagoService.listarMetodosPago();
    res.json(metodos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar métodos de pago",
    });
  }
};

// ✅ Buscar por ID
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

// ✅ Eliminar
const eliminarMetodoPago = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const metodo = await metodoPagoService.eliminarMetodoPago(id);

    if (!metodo) {
      return res.status(404).json({ mensaje: "Método de pago no encontrado" });
    }

    res.json({
      mensaje: "Método de pago eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar método de pago",
    });
  }
};

module.exports = {
  crearMetodoPago,
  listarMetodosPago,
  buscarMetodoPagoPorId,
  eliminarMetodoPago,
};