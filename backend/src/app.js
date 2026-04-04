const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const publicacionRoutes = require("./routes/publicacion.route");
const categoriaRoutes = require("./routes/categoria.route");
const usuarioRoutes = require("./routes/usuario.route");
const mensajeRoutes = require("./routes/mensajeContacto.route");
const metodoPagoRoutes = require("./routes/metodoPago.route");
const datosFacturacionRoutes = require("./routes/datosFacturacion.route");

// Ruta de prueba
app.get("/publicaciones/prueba-app", (req, res) => {
  res.json({ mensaje: "PRUEBA DIRECTA EN APP OK" });
});

// Uso de rutas
app.use("/publicaciones", publicacionRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/mensajes", mensajeRoutes);
app.use("/metodos-pago", metodoPagoRoutes);
app.use("/datos-facturacion", datosFacturacionRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

module.exports = app;