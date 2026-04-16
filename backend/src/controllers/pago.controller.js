const mongoose = require("mongoose");
const Pago = require("../models/pago.model");
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
      return res
        .status(400)
        .json({ mensaje: "El método de pago es obligatorio" });
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
    const { pagoId, titulo, precio } = req.body;

    if (!pagoId || !titulo || !precio) {
      return res.status(400).json({
        mensaje: "pagoId, titulo y precio son obligatorios",
      });
    }

    if (!esObjectIdValido(pagoId)) {
      return res.status(400).json({ mensaje: "pagoId inválido" });
    }

    const pago = await Pago.findById(pagoId)
      .populate("compra")
      .populate("usuario");

    if (!pago) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }

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
        external_reference: pago._id.toString(),
        back_urls: {
          success: "http://localhost:5173/pago-exitoso",
          failure: "http://localhost:5173/pago-fallido",
          pending: "http://localhost:5173/pago-pendiente",
        },
        auto_return: "approved",
      },
    });

    pago.mpPreferenceId = response.id;
    pago.externalReference = pago._id.toString();
    await pago.save();

    res.json({
      id: response.id,
      init_point: response.init_point,
    });
  } catch (error) {
    console.error("Error Mercado Pago:", error);
    res.status(500).json({ error: "Error al crear preferencia de pago" });
  }
};

const procesarPago = async (req, res) => {
  try {
    const { pagoId } = req.body;

    if (!pagoId) {
      return res.status(400).json({ mensaje: "El pagoId es obligatorio" });
    }

    if (!esObjectIdValido(pagoId)) {
      return res.status(400).json({ mensaje: "pagoId inválido" });
    }

    const pago = await Pago.findById(pagoId)
      .populate("metodoPago")
      .populate("usuario")
      .populate("compra");

    if (!pago) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }

    const tipoMetodo = pago.metodoPago?.tipo;

    console.log("Pago:", pago._id);
    console.log("Método:", pago.metodoPago);
    console.log("Tipo método:", tipoMetodo);
    console.log("Monto:", pago.monto);
    console.log("Token MP:", process.env.MP_ACCESS_TOKEN);

    if (tipoMetodo === "TARJETA") {
      const preference = new Preference(client);

      const response = await preference.create({
        body: {
          items: [
            {
              title: "Compra de cursos",
              unit_price: Number(pago.monto),
              quantity: 1,
              currency_id: "ARS",
            },
          ],
          external_reference: pago._id.toString(),
          back_urls: {
            success: "http://localhost:5173/pago-exitoso",
            failure: "http://localhost:5173/pago-fallido",
            pending: "http://localhost:5173/pago-pendiente",
          },
          auto_return: "approved",
        },
      });

      pago.mpPreferenceId = response.id;
      pago.externalReference = pago._id.toString();
      await pago.save();

      return res.json({
        tipo: "mercadopago",
        init_point: response.init_point,
      });
    }

    if (tipoMetodo === "TRANSFERENCIA") {
      return res.json({
        tipo: "transferencia",
        mensaje: "Pago pendiente. Mostrar datos al usuario.",
        datos: {
          banco: "Banco Ejemplo",
          alias: "mi.alias",
          cbu: "0000000000000000000000",
        },
      });
    }

    return res.status(400).json({
      mensaje: "Método de pago no soportado",
    });
  } catch (error) {
    console.error("Error al procesar pago:", error);

    return res.status(500).json({
      mensaje: "Error al procesar el pago",
      error: error.message,
      detalle: error.cause || null,
    });
  }
};
module.exports = {
  crearPago,
  listarPagos,
  buscarPagoPorId,
  aprobarPago,
  rechazarPago,
  crearPreferencia,
  procesarPago,
};
