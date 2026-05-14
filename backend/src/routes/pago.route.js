const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const {
  crearPago,
  listarPagos,
  buscarPagoPorId,
  aprobarPago,
  rechazarPago,
  crearPreferencia,
  procesarPago,
} = require("../controllers/pago.controller");

const pagoService = require("../services/pago.service");
const client = require("../config/mercadoPago");
const { Payment } = require("mercadopago");

const { verificarToken } = require("../middlewares/verificarToken.middleware");
const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");

const validarFirmaMercadoPago = (req) => {
  const secret = process.env.MP_WEBHOOK_SECRET;

  // Para pruebas locales en Postman.
  // Si no hay secret configurado, no bloquea.
  if (!secret) return true;

  const xSignature = req.headers["x-signature"];
  const xRequestId = req.headers["x-request-id"];
  const dataId = req.query["data.id"] || req.body?.data?.id;

  if (!xSignature || !xRequestId || !dataId) {
    return false;
  }

  const partes = xSignature.split(",");
  let ts;
  let hash;

  partes.forEach((parte) => {
    const [key, value] = parte.split("=");
    if (key && value) {
      if (key.trim() === "ts") ts = value.trim();
      if (key.trim() === "v1") hash = value.trim();
    }
  });

  if (!ts || !hash) {
    return false;
  }

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(manifest);

  const firmaCalculada = hmac.digest("hex");

  return firmaCalculada === hash;
};

// Usuario autenticado
router.post("/", verificarToken, crearPago);

router.post("/procesar", verificarToken, procesarPago);

router.post("/crear-preferencia", verificarToken, crearPreferencia);

// Mercado Pago webhook
router.post("/webhook", async (req, res) => {
  try {
    console.log("Webhook Mercado Pago recibido:", req.body);

    const firmaValida = validarFirmaMercadoPago(req);

    if (!firmaValida) {
      console.warn("Webhook Mercado Pago rechazado: firma inválida");
      return res.sendStatus(401);
    }

    // Caso real Mercado Pago: viene un data.id del pago.
    const paymentId = req.body?.data?.id || req.query["data.id"];

    if (paymentId) {
      const paymentClient = new Payment(client);
      const payment = await paymentClient.get({ id: paymentId });

      if (payment.status !== "approved") {
        return res.sendStatus(200);
      }

      const externalReference = payment.external_reference;

      if (!externalReference) {
        return res.sendStatus(200);
      }

      await pagoService.aprobarPago(externalReference);

      return res.sendStatus(200);
    }

    // Caso prueba local con Postman
    const externalReference =
      req.body?.external_reference || req.query?.external_reference;

    if (!externalReference) {
      return res.sendStatus(200);
    }

    await pagoService.aprobarPago(externalReference);

    return res.sendStatus(200);
  } catch (error) {
    console.error("Error procesando webhook Mercado Pago:", error.message);
    return res.sendStatus(200);
  }
});

// Admin
router.get("/", verificarToken, verificarAdmin, listarPagos);

router.get("/:id", verificarToken, verificarAdmin, buscarPagoPorId);

router.patch("/:id/aprobar", verificarToken, verificarAdmin, aprobarPago);

router.patch("/:id/rechazar", verificarToken, verificarAdmin, rechazarPago);

module.exports = router;
