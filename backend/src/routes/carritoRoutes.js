const express = require("express");
const router = express.Router();

const {
  crearCarrito,
  obtenerCarrito,
  agregarItem,
  calcularTotal
} = require("../controllers/carritoController");

router.post("/", crearCarrito);
router.get("/:id", obtenerCarrito);
router.post("/agregar", agregarItem);
router.get("/:id/total", calcularTotal);

module.exports = router;