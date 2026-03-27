const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/carrito", require("./routes/carrito.route"));
app.use("/api/compra", require("./routes/compra.route"));

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Error interno del servidor"
  });
});

module.exports = app;