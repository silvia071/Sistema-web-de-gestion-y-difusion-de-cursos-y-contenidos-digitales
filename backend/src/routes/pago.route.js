const express = require("express");
const router = express.Router();

const {
  crearPago,
  listarPagos,
  buscarPagoPorId,
  aprobarPago,
  rechazarPago,
} = require("../controllers/pago.Controller");

router.get("/", listarPagos);
router.get("/:id", buscarPagoPorId);
router.post("/", crearPago);
router.patch("/:id/aprobar", aprobarPago);
router.patch("/:id/rechazar", rechazarPago);

module.exports = router;