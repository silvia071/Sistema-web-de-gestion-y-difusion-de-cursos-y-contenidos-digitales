const express = require("express");
const router = express.Router();

const {
  crearMetodoPago,
  listarMetodosPago,
  listarTodosMetodosPago,
  buscarMetodoPagoPorId,
  actualizarMetodoPago,
  cambiarEstadoMetodoPago,
  eliminarMetodoPago,
} = require("../controllers/metodoPago.controller");

const { verificarToken } = require("../middlewares/verificarToken.middleware");
const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");

// Público: solamente métodos activos para el checkout
router.get("/", listarMetodosPago);

// Admin: métodos activos e inactivos
router.get(
  "/admin/todos",
  verificarToken,
  verificarAdmin,
  listarTodosMetodosPago,
);

// Buscar un método por ID
router.get("/:id", buscarMetodoPagoPorId);

// Rutas del administrador
router.post("/", verificarToken, verificarAdmin, crearMetodoPago);

router.put("/:id", verificarToken, verificarAdmin, actualizarMetodoPago);

router.patch(
  "/:id/estado",
  verificarToken,
  verificarAdmin,
  cambiarEstadoMetodoPago,
);

router.delete("/:id", verificarToken, verificarAdmin, eliminarMetodoPago);

module.exports = router;
