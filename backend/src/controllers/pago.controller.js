const mongoose = require("mongoose");
const pagoService = require("../services/pago.service");


const client = require("../config/mercadoPago");
const { Preference } = require("mercadopago");

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



const crearPreferencia = async (req, res) => {
  try {
    const { titulo, precio } = req.body;

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: [
          {
            title: titulo,
            unit_price: Number(precio),
            quantity: 1,
          },
        ],
        back_urls: {
          success: "http://localhost:5173/success",
          failure: "http://localhost:5173/failure",
          pending: "http://localhost:5173/pending",
        },
        auto_return: "approved",
      },
    });

    res.json({
      id: response.id,
      init_point: response.init_point,
    });

  } catch (error) {
    console.error("Error Mercado Pago:", error);
    res.status(500).json({ error: "Error al crear preferencia de pago" });
  }
};



module.exports = {
  crearPago,
  listarPagos,
  buscarPagoPorId,
  aprobarPago,
  rechazarPago,
  crearPreferencia,
};