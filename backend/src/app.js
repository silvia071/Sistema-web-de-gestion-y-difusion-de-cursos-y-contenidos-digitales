const express = require('express');
const usuarioRoutes = require('./routes/usuario'); 
const app = express();

app.use(express.json());


app.use('/api/usuarios', usuarioRoutes);

module.exports = app;

