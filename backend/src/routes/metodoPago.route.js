const express = require("express");
const router = express.Router();

const MetodoPago = require("../models/metodoPago");
const Tarjeta = require("../models/tarjeta");
const Transferencia = require("../models/transferencia");

// ➕ Crear tarjeta
router.post("/tarjeta", async (req, res) => {
  const tarjeta = new Tarjeta(req.body);
  await tarjeta.save();
  res.json(tarjeta);
});

// ➕ Crear transferencia
router.post("/transferencia", async (req, res) => {
  const transferencia = new Transferencia(req.body);
  await transferencia.save();
  res.json(transferencia);
});

// 📄 Listar todos
router.get("/", async (req, res) => {
  const metodos = await MetodoPago.find();
  res.json(metodos);
});

module.exports = router;
