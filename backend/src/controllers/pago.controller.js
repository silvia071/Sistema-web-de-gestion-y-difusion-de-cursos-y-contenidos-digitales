const mongoose = require("mongoose");
const pagoService = require("../services/pago.service");

const esObjectIdValido = (id) => mongoose.Types.ObjectId.isValid(id);

const crearPago = async (req, res) => {
  try {
    const { monto, metodoPago } = req.body;

    if (!monto) {
      return res.status(400).json({ mensaje: "El monto es obligatorio" });
    }

    if (!metodoPago) {
      return res.status(400).json({ mensaje: "El método de pago es obligatorio" });
    }

    const pago = await pagoService.crearPago(req.body);

    res.status(201).json(pago);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

const listarPagos = async (req, res) => {
  try {
    const pagos = await pagoService.listarPagos();
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar pagos" });
  }
};

const buscarPagoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const pago = await pagoService.buscarPagoPorId(id);

    if (!pago) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }

    res.json(pago);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al buscar pago" });
  }
};

const aprobarPago = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const pago = await pagoService.aprobarPago(id);

    if (!pago) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }

    res.json(pago);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al aprobar pago" });
  }
};

const rechazarPago = async (req, res) => {
  try {
    const { id } = req.params;

    if (!esObjectIdValido(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }

    const pago = await pagoService.rechazarPago(id);

    if (!pago) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }

    res.json(pago);
  } catch (error) {
    res.status(400).json({ mensaje: "Error al rechazar pago" });
  }
};

module.exports = {
  crearPago,
  listarPagos,
  buscarPagoPorId,
  aprobarPago,
  rechazarPago,
};