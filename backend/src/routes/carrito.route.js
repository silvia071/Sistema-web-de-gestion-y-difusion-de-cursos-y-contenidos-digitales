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

const { verificarToken } = require("../middlewares/verificarToken.middleware");

// Todas requieren usuario autenticado
router.post("/", verificarToken, crearCarrito);

router.get("/:id", verificarToken, obtenerCarrito);

router.post("/:id/item", verificarToken, agregarItem);

router.delete("/:id/item/:itemId", verificarToken, eliminarItem);

router.delete("/:id/vaciar", verificarToken, vaciarCarrito);

router.get("/:id/total", verificarToken, calcularTotal);

module.exports = router;
