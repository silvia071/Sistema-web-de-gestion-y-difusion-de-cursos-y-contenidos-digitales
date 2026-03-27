const express = require("express");
const router = express.Router();

const {
  crearCarrito,
  obtenerCarrito,
  agregarItem,
  calcularTotal
} = require("../controllers/carrito.controller");

router.post("/", crearCarrito);
router.get("/:id", obtenerCarrito);
router.post("/:id/agregar", agregarItem);
router.get("/:id/total", calcularTotal);

module.exports = router;