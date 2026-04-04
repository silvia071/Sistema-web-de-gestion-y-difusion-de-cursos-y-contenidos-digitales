const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const usuarioRoutes = require("./routes/usuario.route");
const cursoRoutes = require("./routes/curso.route");
const leccionRoutes = require("./routes/leccion.route");
const publicacionRoutes = require("./routes/publicacion.route");
const categoriaRoutes = require("./routes/categoria.route");
const mensajeRoutes = require("./routes/mensajeContacto.route");
const metodoPagoRoutes = require("./routes/metodoPago.route");
const datosFacturacionRoutes = require("./routes/datosFacturacion.route");
const carritoRoutes = require("./routes/carrito.route");
const compraRoutes = require("./routes/compra.route");

// Uso de rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/cursos", cursoRoutes);
app.use("/lecciones", leccionRoutes);
app.use("/publicaciones", publicacionRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/mensajes", mensajeRoutes);
app.use("/metodos-pago", metodoPagoRoutes);
app.use("/datos-facturacion", datosFacturacionRoutes);
app.use("/api/carrito", carritoRoutes);
app.use("/api/compra", compraRoutes);

// Ruta de prueba
app.get("/publicaciones/prueba-app", (req, res) => {
  res.json({ mensaje: "PRUEBA DIRECTA EN APP OK" });
});

// Ruta raíz
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// Middleware de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Error interno del servidor",
  });
});

module.exports = app;
