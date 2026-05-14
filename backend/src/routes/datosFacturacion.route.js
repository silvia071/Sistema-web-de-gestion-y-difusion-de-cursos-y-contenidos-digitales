const express = require("express");
const router = express.Router();

const {
  crearDatosFacturacion,
  listarDatosFacturacion,
  buscarDatosFacturacion,
  actualizarDatosFacturacion,
  eliminarDatosFacturacion,
  obtenerMisDatosFacturacion,
  actualizarMisDatosFacturacion,
} = require("../controllers/datosFacturacion.controller");

const { verificarToken } = require("../middlewares/verificarToken.middleware");
const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");

// Cliente: crear sus propios datos de facturación
router.post("/", verificarToken, crearDatosFacturacion);

// Admin: listar todos los datos de facturación
router.get("/", verificarToken, verificarAdmin, listarDatosFacturacion);

// Cliente: obtener sus propios datos de facturación
router.get("/mis-datos", verificarToken, obtenerMisDatosFacturacion);

// Cliente: crear o actualizar sus propios datos de facturación
router.put("/mis-datos", verificarToken, actualizarMisDatosFacturacion);

// Admin o dueño del dato: ver un dato específico
router.get("/:id", verificarToken, buscarDatosFacturacion);

// Admin o dueño del dato: actualizar un dato específico
router.put("/:id", verificarToken, actualizarDatosFacturacion);

// Admin o dueño del dato: eliminar un dato específico
router.delete("/:id", verificarToken, eliminarDatosFacturacion);

module.exports = router;
