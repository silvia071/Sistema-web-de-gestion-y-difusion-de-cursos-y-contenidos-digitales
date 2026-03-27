const express = require("express");
const router = express.Router();
const { generarCompra } = require("../controllers/compra.controller");

router.post("/:id", generarCompra);

module.exports = router;