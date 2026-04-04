const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const publicacionRoutes = require("./routes/publicacion.route");
const categoriaRoutes = require("./routes/categoria.route");

app.get("/publicaciones/prueba-app", (req, res) => {
  res.json({ mensaje: "PRUEBA DIRECTA EN APP OK" });
});

app.use("/publicaciones", publicacionRoutes);
app.use("/categorias", categoriaRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

module.exports = app;