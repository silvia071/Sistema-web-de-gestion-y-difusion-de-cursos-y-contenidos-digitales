const express = require("express");
const router = express.Router();

const {
  iniciarSesion,
  registrarUsuario,
} = require("../controllers/auth.controller");

const {
  validarLogin,
  validarRegistro,
} = require("../middlewares/usuario.validator");

router.post("/login", validarLogin, iniciarSesion);
router.post("/register", validarRegistro, registrarUsuario);

module.exports = router;
