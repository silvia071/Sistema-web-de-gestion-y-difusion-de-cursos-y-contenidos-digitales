const express = require("express");
const router = express.Router();

const {
  getPublicaciones,
  getPublicacionById,
  createPublicacion,
  updatePublicacion,
  deletePublicacion,
} = require("../controllers/publicacion.controller");

router.get("/", getPublicaciones);
router.get("/:id", getPublicacionById);
router.post("/", createPublicacion);
router.put("/:id", updatePublicacion);
router.delete("/:id", (req, res) => {
  console.log("ENTRÓ A LA RUTA DELETE");
  res.json({
    mensaje: "Ruta DELETE funcionando",
    id: req.params.id,
  });
});

module.exports = router;
