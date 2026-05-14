const express = require("express");
const router = express.Router();

const {
  crearCurso,
  editarCurso,
  eliminarCurso,
  listarCursos,
  listarCursosAdmin,
  buscarCursoPorId,
  publicarCurso,
  ocultarCurso,
} = require("../controllers/curso.controller");

const { verificarToken } = require("../middlewares/verificarToken.middleware");
const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");
const { validarId } = require("../middlewares/usuario.validator");

// Públicas
router.get("/", listarCursos);

// Admin
router.get("/admin/todos", verificarToken, verificarAdmin, listarCursosAdmin);

router.get(
  "/admin/:id",
  verificarToken,
  verificarAdmin,
  validarId,
  buscarCursoPorId,
);

router.post("/", verificarToken, verificarAdmin, crearCurso);

router.put("/:id", verificarToken, verificarAdmin, validarId, editarCurso);

router.delete("/:id", verificarToken, verificarAdmin, validarId, eliminarCurso);

router.patch(
  "/:id/publicar",
  verificarToken,
  verificarAdmin,
  validarId,
  publicarCurso,
);

router.patch(
  "/:id/ocultar",
  verificarToken,
  verificarAdmin,
  validarId,
  ocultarCurso,
);

// Pública por ID
router.get("/:id", validarId, buscarCursoPorId);

module.exports = router;
