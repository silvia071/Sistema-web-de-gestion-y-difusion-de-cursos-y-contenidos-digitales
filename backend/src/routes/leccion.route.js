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

const { verificarToken } = require("../middlewares/verificarToken.middleware");
const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");
const { validarId } = require("../middlewares/usuario.validator");

// Prueba rápida de ruta
router.get("/test-directo", (req, res) => {
  res.json({ mensaje: "Ruta de lecciones funcionando" });
});

// Admin: listar lecciones de cualquier curso
router.get(
  "/admin/curso/:cursoId",
  verificarToken,
  verificarAdmin,
  listarLeccionesPorCurso,
);

// Ver contenido: usuario autenticado con acceso al curso
router.get(
  "/curso/:cursoId",
  verificarToken,
  validarAccesoPorCurso,
  listarLeccionesPorCurso,
);

// Buscar una lección por ID
router.get(
  "/:id",
  verificarToken,
  validarId,
  validarAccesoPorLeccion,
  buscarLeccionPorId,
);

// Administrar contenido: solo administrador
router.post("/", verificarToken, verificarAdmin, crearLeccion);

router.put("/:id", verificarToken, verificarAdmin, validarId, editarLeccion);

router.delete(
  "/:id",
  verificarToken,
  verificarAdmin,
  validarId,
  eliminarLeccion,
);

router.patch(
  "/:id/publicar",
  verificarToken,
  verificarAdmin,
  validarId,
  publicarLeccion,
);

router.patch(
  "/:id/ocultar",
  verificarToken,
  verificarAdmin,
  validarId,
  ocultarLeccion,
);

router.patch(
  "/curso/:cursoId/ordenar",
  verificarToken,
  verificarAdmin,
  ordenarLecciones,
);

module.exports = router;
