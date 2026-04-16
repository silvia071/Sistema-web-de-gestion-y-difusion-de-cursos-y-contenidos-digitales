const express = require("express");
const router = express.Router();

const {
  generarCompra,
  eliminarCompra,
} = require("../controllers/compra.controller");

// 🔹 Generar compra desde carrito
router.post("/desde-carrito/:id", generarCompra);

// 🔹 Eliminar compra
router.delete("/:id", eliminarCompra);

module.exports = router;
