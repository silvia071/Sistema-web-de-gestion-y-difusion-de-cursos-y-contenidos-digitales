const express = require("express");
const router = express.Router();

const Usuario = require("../models/usuario");


// ➕ Crear usuario (registro)
router.post("/", async (req, res) => {
  try {
    const usuario = new Usuario(req.body);
    await usuario.save();

    // no devolver password
    usuario.password = undefined;

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔑 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const esValida = await usuario.compararPassword(password);

    if (!esValida) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    usuario.password = undefined;

    res.json({
      mensaje: "Login exitoso",
      usuario
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 📄 Obtener todos
router.get("/", async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🔍 Obtener por ID
router.get("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✏️ Actualizar (IMPORTANTE para bcrypt)
router.put("/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    Object.assign(usuario, req.body);

    await usuario.save(); // 🔐 activa el hash si cambia password

    usuario.password = undefined;

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ❌ Eliminar
router.delete("/:id", async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;