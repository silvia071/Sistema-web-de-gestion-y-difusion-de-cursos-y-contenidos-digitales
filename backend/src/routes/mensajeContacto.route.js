const express = require("express");
const router = express.Router();

const Mensaje = require("../models/mensajeContacto");

router.post("/", async (req, res) => {
  const mensaje = new Mensaje(req.body);
  await mensaje.save();
  res.json(mensaje);
});

router.get("/", async (req, res) => {
  const mensajes = await Mensaje.find().populate("usuario");
  res.json(mensajes);
});

router.get("/:id", async (req, res) => {
  const mensaje = await Mensaje.findById(req.params.id).populate("usuario");
  res.json(mensaje);
});

router.put("/:id/leido", async (req, res) => {
  const mensaje = await Mensaje.findByIdAndUpdate(
    req.params.id,
    { estado: "LEIDO" },
    { new: true }
  );
  res.json(mensaje);
});

router.put("/:id/responder", async (req, res) => {
  const mensaje = await Mensaje.findByIdAndUpdate(
    req.params.id,
    { estado: "RESPONDIDO" },
    { new: true }
  );
  res.json(mensaje);
});

router.delete("/:id", async (req, res) => {
  const mensaje = await Mensaje.findByIdAndUpdate(
    req.params.id,
    { estado: "ELIMINADO" },
    { new: true }
  );
  res.json(mensaje);
});

module.exports = router;