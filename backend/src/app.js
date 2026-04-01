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

app.use("/usuarios", usuarioRoutes);
app.use("/mensajes", mensajeRoutes);
app.use("/metodos-pago", metodoPagoRoutes);
app.use("/datos-facturacion", datosFacturacionRoutes);

// ruta test
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

module.exports = app;