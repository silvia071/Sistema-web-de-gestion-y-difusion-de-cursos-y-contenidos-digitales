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

const { verificarToken } = require("../middlewares/verificarToken.middleware");

const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");

router.get("/", getPublicaciones);
router.get("/:id", getPublicacionById);

router.post("/", verificarToken, verificarAdmin, createPublicacion);

router.put("/:id", verificarToken, verificarAdmin, updatePublicacion);

router.delete("/:id", verificarToken, verificarAdmin, deletePublicacion);

router.patch(
  "/:id/publicar",
  verificarToken,
  verificarAdmin,
  publicarPublicacion,
);

router.patch(
  "/:id/ocultar",
  verificarToken,
  verificarAdmin,
  ocultarPublicacion,
);

module.exports = router;
