const express = require("express");
const router = express.Router();

const {
  obtenerAccesosUsuario,
  crearAccesoCurso,
  actualizarProgreso,
} = require("../controllers/accesoCurso.controller");

// Obtener todos los accesos de un usuario
router.get("/usuario/:usuarioId", obtenerAccesosUsuario);

// Crear acceso a un curso (cuando compra o se habilita)
router.post("/", crearAccesoCurso);

// Actualizar progreso del curso
router.patch("/:id/progreso", actualizarProgreso);

module.exports = router;
