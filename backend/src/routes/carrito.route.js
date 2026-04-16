const express = require("express");
const router = express.Router();

const {
  crearCarrito,
  obtenerCarrito,
  agregarItem,
  eliminarItem,
  vaciarCarrito,
  calcularTotal,
} = require("../controllers/carrito.controller");

router.post("/", crearCarrito);
router.get("/:id", obtenerCarrito);
router.post("/:id/item", agregarItem);
router.delete("/:id/item/:itemId", eliminarItem);
router.delete("/:id/vaciar", vaciarCarrito);
router.get("/:id/total", calcularTotal);

module.exports = router;
