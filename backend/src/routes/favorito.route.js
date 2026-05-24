const express = require("express");
const favoritoController = require("../controllers/favorito.controller");
const { verificarToken } = require("../middlewares/verificarToken.middleware");

const router = express.Router();

router.get("/", verificarToken, favoritoController.listarMisFavoritos);

router.get("/ids", verificarToken, favoritoController.obtenerIdsMisFavoritos);

router.post("/", verificarToken, favoritoController.agregarFavorito);

router.patch(
  "/:cursoId/toggle",
  verificarToken,
  favoritoController.alternarFavorito,
);

router.delete("/:cursoId", verificarToken, favoritoController.quitarFavorito);

module.exports = router;
