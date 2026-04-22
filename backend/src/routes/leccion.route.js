const express = require("express");
const router = express.Router();

const {
  crearLeccion,
  editarLeccion,
  eliminarLeccion,
  listarLeccionesPorCurso,
  buscarLeccionPorId,
  publicarLeccion,
  ocultarLeccion,
  ordenarLecciones,
} = require("../controllers/leccion.controller");

const {
  validarAccesoPorCurso,
  validarAccesoPorLeccion,
} = require("../middlewares/accesoCurso.validator");

// Estas dos rutas son para VER contenido
router.get("/curso/:cursoId", validarAccesoPorCurso, listarLeccionesPorCurso);
router.get("/:id", validarAccesoPorLeccion, buscarLeccionPorId);

// Estas rutas son para ADMINISTRAR contenido
router.post("/", crearLeccion);
router.put("/:id", editarLeccion);
router.delete("/:id", eliminarLeccion);
router.patch("/:id/publicar", publicarLeccion);
router.patch("/:id/ocultar", ocultarLeccion);
router.patch("/curso/:cursoId/ordenar", ordenarLecciones);

module.exports = router;
