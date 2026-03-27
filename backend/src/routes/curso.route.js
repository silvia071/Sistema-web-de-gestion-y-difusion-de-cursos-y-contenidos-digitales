const express = require("express");
const router = express.Router();

const {
  crearCurso,
  editarCurso,
  eliminarCurso,
  listarCursos,
  buscarCursoPorId,
  publicarCurso,
  ocultarCurso,
} = require("../controllers/curso.controller");

router.get("/", listarCursos);
router.get("/:id", buscarCursoPorId);
router.post("/", crearCurso);
router.put("/:id", editarCurso);
router.delete("/:id", eliminarCurso);
router.patch("/:id/publicar", publicarCurso);
router.patch("/:id/ocultar", ocultarCurso);

module.exports = router;
