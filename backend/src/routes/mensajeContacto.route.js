const express = require("express");
const router = express.Router();

const {
  crearMensaje,
  listarMensajes,
  buscarMensajePorId,
  marcarComoLeido,
  marcarComoRespondido,
  responderMensaje,
  eliminarMensaje,
} = require("../controllers/mensajeContacto.controller");

const { verificarToken } = require("../middlewares/verificarToken.middleware");
const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");

// Público
router.post("/", crearMensaje);

// Admin
router.get("/", verificarToken, verificarAdmin, listarMensajes);

router.get("/:id", verificarToken, verificarAdmin, buscarMensajePorId);

router.patch("/:id/leido", verificarToken, verificarAdmin, marcarComoLeido);

router.patch(
  "/:id/respondido",
  verificarToken,
  verificarAdmin,
  marcarComoRespondido,
);

router.patch(
  "/:id/responder",
  verificarToken,
  verificarAdmin,
  responderMensaje,
);

router.patch("/:id/eliminar", verificarToken, verificarAdmin, eliminarMensaje);

module.exports = router;
