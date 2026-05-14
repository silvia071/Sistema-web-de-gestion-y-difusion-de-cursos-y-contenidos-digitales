const express = require("express");
const router = express.Router();

const {
  crearMetodoPago,
  listarMetodosPago,
  buscarMetodoPagoPorId,
  eliminarMetodoPago,
} = require("../controllers/metodoPago.controller");

const { verificarToken } = require("../middlewares/verificarToken.middleware");
const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");

// Públicas
router.get("/", listarMetodosPago);
router.get("/:id", buscarMetodoPagoPorId);

// Admin
router.post("/", verificarToken, verificarAdmin, crearMetodoPago);

router.delete("/:id", verificarToken, verificarAdmin, eliminarMetodoPago);

module.exports = router;
