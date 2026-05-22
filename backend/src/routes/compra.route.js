const express = require("express");
const router = express.Router();

const {
  generarCompra,
  eliminarCompra,
  obtenerMisCompras,
  obtenerMiCompraPorId,
  obtenerTodasLasCompras,
  obtenerCompraPorIdAdmin,
} = require("../controllers/compra.controller");

const { verificarToken } = require("../middlewares/verificarToken.middleware");
const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");

router.post("/desde-carrito/:id", verificarToken, generarCompra);

router.get("/mis-compras", verificarToken, obtenerMisCompras);
router.get("/mis-compras/:id", verificarToken, obtenerMiCompraPorId);

router.get(
  "/admin/todas",
  verificarToken,
  verificarAdmin,
  obtenerTodasLasCompras,
);
router.get(
  "/admin/:id",
  verificarToken,
  verificarAdmin,
  obtenerCompraPorIdAdmin,
);

router.delete("/:id", verificarToken, verificarAdmin, eliminarCompra);

module.exports = router;
