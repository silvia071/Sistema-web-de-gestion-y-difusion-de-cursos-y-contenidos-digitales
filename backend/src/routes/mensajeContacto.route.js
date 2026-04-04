const express = require("express");
const router = express.Router();

const {
  crearMensaje,
  listarMensajes,
  buscarMensajePorId,
  marcarComoLeido,
  marcarComoRespondido,
  eliminarMensaje
} = require("../controllers/mensajeContacto.controller");

router.post("/", crearMensaje);
router.get("/", listarMensajes);
router.get("/:id", buscarMensajePorId);

router.patch("/:id/leido", marcarComoLeido);
router.patch("/:id/respondido", marcarComoRespondido);
router.patch("/:id/eliminar", eliminarMensaje);

module.exports = router;