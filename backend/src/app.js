require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// rutas
const usuarioRoutes = require("./routes/usuario.route");
const mensajeRoutes = require("./routes/mensajeContacto.route");
const metodoPagoRoutes = require("./routes/metodoPago.route");
const datosFacturacionRoutes = require("./routes/datosFacturacion.route");
const pagoRoutes = require("./routes/pago.route");
const mensajeContactoRoutes = require("./routes/mensajeContacto.route");

app.use("/usuarios", usuarioRoutes);
app.use("/mensajes", mensajeRoutes);
app.use("/metodos-pago", metodoPagoRoutes);
app.use("/datos-facturacion", datosFacturacionRoutes);
app.use("/pagos", pagoRoutes);
app.use("/mensaje-contacto", mensajeContactoRoutes);


module.exports = app;


