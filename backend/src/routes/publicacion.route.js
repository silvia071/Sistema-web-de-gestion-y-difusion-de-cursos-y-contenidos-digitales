const express = require("express");
const router = express.Router();

const {
  getPublicaciones,
  getPublicacionById,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
  publicarPublicacion,
  ocultarPublicacion,
} = require("../controllers/publicacion.controller");

router.get("/", getPublicaciones);
router.get("/:id", getPublicacionById);
router.post("/", createPublicacion);
router.put("/:id", updatePublicacion);
router.delete("/:id", deletePublicacion);
router.patch("/:id/publicar", publicarPublicacion);
router.patch("/:id/ocultar", ocultarPublicacion);

module.exports = router;
