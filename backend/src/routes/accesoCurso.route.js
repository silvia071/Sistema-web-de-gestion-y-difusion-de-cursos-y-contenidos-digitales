const express = require("express");
const router = express.Router();

const {
  obtenerAccesosUsuario,
  crearAccesoCurso,
  actualizarProgreso,
} = require("../controllers/accesoCurso.controller");

const { verificarToken } = require("../middlewares/verificarToken.middleware");
const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");
const {
  verificarMismoUsuarioOAdmin,
} = require("../middlewares/verificarMismoUsuarioOAdmin.middleware");

// Usuario propio o admin
router.get(
  "/usuario/:id",
  verificarToken,
  verificarMismoUsuarioOAdmin,
  obtenerAccesosUsuario,
);

// Admin
router.post("/", verificarToken, verificarAdmin, crearAccesoCurso);

// Usuario autenticado
router.patch("/:id/progreso", verificarToken, actualizarProgreso);

module.exports = router;
