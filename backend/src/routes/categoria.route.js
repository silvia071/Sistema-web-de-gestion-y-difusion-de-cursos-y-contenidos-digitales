const express = require("express");
const router = express.Router();

const {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} = require("../controllers/categoria.controller");

const { verificarToken } = require("../middlewares/verificarToken.middleware");

const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");

router.get("/", getCategorias);
router.get("/:id", getCategoriaById);

router.post("/", verificarToken, verificarAdmin, createCategoria);
router.put("/:id", verificarToken, verificarAdmin, updateCategoria);
router.delete("/:id", verificarToken, verificarAdmin, deleteCategoria);

module.exports = router;
