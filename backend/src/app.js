const express = require("express");
const app = express();

const cursoRoutes = require("./routes/curso.route");
const leccionRoutes = require("./routes/leccion.route");

app.use(express.json());

app.use("/cursos", cursoRoutes);
app.use("/lecciones", leccionRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando");
});

module.exports = app;
