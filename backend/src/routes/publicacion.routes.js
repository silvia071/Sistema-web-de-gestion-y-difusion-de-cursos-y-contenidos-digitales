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
router.delete("/:id", deletePublicacion);

module.exports = router;
