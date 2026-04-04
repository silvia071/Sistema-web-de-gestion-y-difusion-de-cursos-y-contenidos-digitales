const express = require("express");
const router = express.Router();

const {
  crearMetodoPago,
  listarMetodosPago,
  buscarMetodoPagoPorId,
  eliminarMetodoPago,
} = require("../controllers/metodoPago.controller");

router.get("/", listarMetodosPago);
router.get("/:id", buscarMetodoPagoPorId);
router.post("/", crearMetodoPago);
router.delete("/:id", eliminarMetodoPago);

module.exports = router;