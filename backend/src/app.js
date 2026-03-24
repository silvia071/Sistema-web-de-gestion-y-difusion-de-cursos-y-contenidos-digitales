const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/carrito", require("./routes/carritoRoutes"));
app.use("/api/compra", require("./routes/compraRoutes"));



module.exports = app;