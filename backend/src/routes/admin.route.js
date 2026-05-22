const express = require("express");
const router = express.Router();

const { obtenerResumenAdmin } = require("../controllers/admin.controller");

const { verificarToken } = require("../middlewares/verificarToken.middleware");
const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");

router.get("/resumen", verificarToken, verificarAdmin, obtenerResumenAdmin);

module.exports = router;
