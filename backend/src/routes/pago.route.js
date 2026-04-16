const express = require("express");
const router = express.Router();

const {
  crearPago,
  listarPagos,
  buscarPagoPorId,
  aprobarPago,
  rechazarPago,
  crearPreferencia,
  procesarPago, // 👈 AGREGAR
} = require("../controllers/pago.controller");

// 🔹 RUTAS GENERALES
router.get("/", listarPagos);
router.post("/", crearPago);

// 🔹 🔥 NUEVA RUTA CLAVE
router.post("/procesar", procesarPago);

// 🔹 MERCADO PAGO (opcional, podés dejarla)
router.post("/crear-preferencia", crearPreferencia);

// 🔹 WEBHOOK (para después usar con MP)
router.post("/webhook", (req, res) => {
  console.log("Webhook recibido:", req.body);
  res.sendStatus(200);
});

// 🔹 RUTAS CON ID (siempre al final)
router.get("/:id", buscarPagoPorId);
router.patch("/:id/aprobar", aprobarPago);
router.patch("/:id/rechazar", rechazarPago);

module.exports = router;
