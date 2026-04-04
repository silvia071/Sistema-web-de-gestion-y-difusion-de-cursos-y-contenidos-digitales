const express = require("express");
const router = express.Router();
const { generarCompra } = require("../controllers/compra.controller");
const { eliminarCompra } = require("../controllers/compra.controller");

router.post("/:id", generarCompra);
router.delete("/:id", eliminarCompra);  


module.exports = router;