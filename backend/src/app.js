require("dotenv").config(); // 👈 PRIMERO

console.log("URI:", process.env.MONGO_URI);

console.log("URI:", process.env.MONGO_URI);

const express = require('express');
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(express.json());

// 🔌 conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB conectado"))
  .catch(err => console.log("❌ Error Mongo:", err));

// modelo
const Usuario = require("./models/usuario");

// ruta test
app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

// ➕ crear usuario
app.post("/usuarios", async (req, res) => {
  console.log("ENTRÓ AL POST");

  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.json(usuario);
  } catch (error) {
    console.error("ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// 📄 obtener todos
app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.find();
  res.json(usuarios);
});

// 🔍 obtener por ID
app.get("/usuarios/:id", async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  res.json(usuario);
});

// ✏️ actualizar
app.put("/usuarios/:id", async (req, res) => {
  const usuario = await Usuario.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(usuario);
});

// ❌ eliminar
app.delete("/usuarios/:id", async (req, res) => {
  await Usuario.findByIdAndDelete(req.params.id);
  res.send("Usuario eliminado");
});

module.exports = app;

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server corriendo en http://localhost:${PORT}`);
});

// rutas mensajesContacto
const mensajeRoutes = require("./routes/mensajeContacto.routes");
app.use("/mensajes", mensajeRoutes);

// rutas métodos de pago
const metodoPagoRoutes = require("./routes/metodoPago.routes");
app.use("/metodos-pago", metodoPagoRoutes);

// rutas facturacion
const datosFacturacionRoutes = require("./routes/datosFacturacion.routes");
app.use("/datos-facturacion", datosFacturacionRoutes);