const express = require("express");
const router = express.Router();

const {
  crearCompra,
  obtenerCompra,
  checkout,
  confirmarCompra
} = require("../controllers/compraController");

router.post("/", crearCompra);
router.get("/:id", obtenerCompra);
router.post("/checkout", checkout);
router.put("/:id/confirmar", confirmarCompra);

module.exports = router;