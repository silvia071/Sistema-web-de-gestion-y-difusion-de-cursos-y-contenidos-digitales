const express = require("express");
const app = express();

const publicacionRoutes = require("./routes/publicacion.routes");
const categoriaRoutes = require("./routes/categoria.routes");

app.use(express.json());

app.get("/publicaciones/prueba-app", (req, res) => {
  res.json({ mensaje: "PRUEBA DIRECTA EN APP OK" });
});

app.use("/publicaciones", publicacionRoutes);
app.use("/categorias", categoriaRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

module.exports = app;
