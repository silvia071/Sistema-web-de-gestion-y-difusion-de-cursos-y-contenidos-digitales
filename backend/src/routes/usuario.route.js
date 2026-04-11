const express = require("express");
const router = express.Router();

const {
  registrarUsuario,
  iniciarSesion,
  cerrarSesion,
  listarUsuarios,
  buscarUsuarioPorId,
  buscarUsuarioPorEmail,
  editarPerfil,
  cambiarContrasenia,
  eliminarUsuario,
  bloquearUsuario,
  activarUsuario,
  cambiarRol,
  actualizarEmail,
  actualizarDireccion,
  actualizarTelefono,
  listarCursosAdquiridos,
} = require("../controllers/usuario.controller");

const {
  validarRegistro,
  validarLogin,
  validarId,
  validarCambioRol,
  validarEditarPerfil,
} = require("../middlewares/usuario.validator");

// 👇 IMPORTANTE: todos con {}
const { verificarToken } = require("../middlewares/verificarToken.middleware");
const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");
const {
  verificarMismoUsuarioOAdmin,
} = require("../middlewares/verificarMismoUsuarioOAdmin.middleware");

// 🔓 Públicas
router.post("/registro", validarRegistro, registrarUsuario);
router.post("/login", validarLogin, iniciarSesion);

// 🔐 Autenticadas
router.post("/logout", verificarToken, cerrarSesion);

// 👑 Admin
router.get("/", verificarAdmin, listarUsuarios);
router.get("/email/:email", verificarAdmin, buscarUsuarioPorEmail);

router.put("/bloquear/:id", verificarAdmin, validarId, bloquearUsuario);
router.put("/activar/:id", verificarAdmin, validarId, activarUsuario);
router.put("/rol/:id", verificarAdmin, validarId, validarCambioRol, cambiarRol);

router.delete("/:id", verificarAdmin, validarId, eliminarUsuario);

// 👤 Usuario propio o admin
router.get(
  "/:id",
  verificarToken,
  validarId,
  verificarMismoUsuarioOAdmin,
  buscarUsuarioPorId
);

router.get(
  "/:id/mis-cursos",
  verificarToken,
  validarId,
  verificarMismoUsuarioOAdmin,
  listarCursosAdquiridos
);

router.put(
  "/perfil/:id",
  verificarToken,
  validarId,
  validarEditarPerfil,
  verificarMismoUsuarioOAdmin,
  editarPerfil
);

router.put(
  "/password/:id",
  verificarToken,
  validarId,
  verificarMismoUsuarioOAdmin,
  cambiarContrasenia
);

router.patch(
  "/email/:id",
  verificarToken,
  validarId,
  verificarMismoUsuarioOAdmin,
  actualizarEmail
);

router.patch(
  "/direccion/:id",
  verificarToken,
  validarId,
  verificarMismoUsuarioOAdmin,
  actualizarDireccion
);

router.patch(
  "/telefono/:id",
  verificarToken,
  validarId,
  verificarMismoUsuarioOAdmin,
  actualizarTelefono
);

module.exports = router;