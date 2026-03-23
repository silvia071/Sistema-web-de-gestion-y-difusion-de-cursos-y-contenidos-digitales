const express = require("express");
const app = express();

const publicacionRoutes = require("./routes/publicacion.routes");
const categoriaRoutes = require("./routes/categoria.routes");

app.use(express.json());

app.use("/publicaciones", publicacionRoutes);
app.use("/categorias", categoriaRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.delete("/prueba", (req, res) => {
  console.log("ENTRÓ A /prueba");
  res.json({ mensaje: "DELETE de prueba funcionando" });
});

module.exports = app;
