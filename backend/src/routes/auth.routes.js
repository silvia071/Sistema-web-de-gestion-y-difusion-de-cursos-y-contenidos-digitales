const express = require("express");
const router = express.Router();

const {
  iniciarSesion,
  registrarUsuario,
  solicitarRecuperacionContrasenia,
  restablecerContrasenia,
} = require("../controllers/auth.controller");

const {
  validarLogin,
  validarRegistroPublico,
} = require("../middlewares/usuario.validator");

router.post("/login", validarLogin, iniciarSesion);
router.post("/register", validarRegistroPublico, registrarUsuario);

router.post("/recuperar-contrasenia", solicitarRecuperacionContrasenia);
router.post("/restablecer-contrasenia/:token", restablecerContrasenia);

module.exports = router;
