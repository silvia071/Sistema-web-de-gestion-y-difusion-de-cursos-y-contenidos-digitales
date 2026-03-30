const express = require("express");
const router = express.Router();

const Mensaje = require("../models/mensajeContacto");

// ➕ Enviar mensaje
router.post("/", async (req, res) => {
  const mensaje = new Mensaje(req.body);
  await mensaje.save();
  res.json(mensaje);
});

// 📄 Listar mensajes
router.get("/", async (req, res) => {
  const mensajes = await Mensaje.find().populate("usuario");
  res.json(mensajes);
});

// 🔍 Buscar por ID
router.get("/:id", async (req, res) => {
  const mensaje = await Mensaje.findById(req.params.id).populate("usuario");
  res.json(mensaje);
});

// 📌 Marcar como leído
router.put("/:id/leido", async (req, res) => {
  const mensaje = await Mensaje.findByIdAndUpdate(
    req.params.id,
    { estado: "LEIDO" },
    { new: true }
  );
  res.json(mensaje);
});

// 📌 Marcar como respondido
router.put("/:id/responder", async (req, res) => {
  const mensaje = await Mensaje.findByIdAndUpdate(
    req.params.id,
    { estado: "RESPONDIDO" },
    { new: true }
  );
  res.json(mensaje);
});

// ❌ Eliminar (lógico)
router.delete("/:id", async (req, res) => {
  const mensaje = await Mensaje.findByIdAndUpdate(
    req.params.id,
    { estado: "ELIMINADO" },
    { new: true }
  );
  res.json(mensaje);
});

module.exports = router;