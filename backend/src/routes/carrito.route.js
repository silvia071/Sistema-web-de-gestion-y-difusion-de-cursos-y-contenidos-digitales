const express = require("express");
const router = express.Router();

const {
  crearCarrito,
  obtenerCarrito,
  agregarItem,
  eliminarItem,
  actualizarItem,
  calcularTotal
} = require("../controllers/carrito.controller");

router.post("/", crearCarrito);
router.get("/:id", obtenerCarrito);
router.post("/:id/agregar", agregarItem);
router.delete("/:id/item/:itemId", eliminarItem);
router.put("/:id/item/:itemId", actualizarItem);
router.get("/:id/total", calcularTotal);

module.exports = router;