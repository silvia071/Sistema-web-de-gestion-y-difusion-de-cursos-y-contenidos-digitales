const express = require("express");
const router = express.Router();

const DatosFacturacion = require("../models/datosFacturacion");

// ➕ Crear datos
router.post("/", async (req, res) => {
  try {
    const datos = new DatosFacturacion(req.body);
    await datos.save();
    res.json(datos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📄 Listar todos
router.get("/", async (req, res) => {
  const datos = await DatosFacturacion.find().populate("usuario");
  res.json(datos);
});

// 🔍 Buscar por ID
router.get("/:id", async (req, res) => {
  const datos = await DatosFacturacion.findById(req.params.id).populate("usuario");
  res.json(datos);
});

// ✏️ Actualizar
router.put("/:id", async (req, res) => {
  const datos = await DatosFacturacion.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(datos);
});

// ❌ Eliminar
router.delete("/:id", async (req, res) => {
  await DatosFacturacion.findByIdAndDelete(req.params.id);
  res.send("Datos de facturación eliminados");
});

module.exports = router;