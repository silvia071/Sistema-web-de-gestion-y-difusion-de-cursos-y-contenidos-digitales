const express = require("express");
const router = express.Router();

const {
  crearDatosFacturacion,
  listarDatosFacturacion,
  buscarDatosFacturacion,
  actualizarDatosFacturacion,
  eliminarDatosFacturacion
} = require("../controllers/datosFacturacion.controller");

router.post("/", crearDatosFacturacion);
router.get("/", listarDatosFacturacion);
router.get("/:id", buscarDatosFacturacion);
router.put("/:id", actualizarDatosFacturacion);
router.delete("/:id", eliminarDatosFacturacion);

module.exports = router;