const express = require('express');
const mongoose = require('mongoose');
const usuarioRoutes = require('../routes/usuario');
const administradorRoutes = require('../routes/administrador');

const app = express();

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/proyecto-cursos')
    .then(() => console.log('Conectado a MongoDB: proyecto-cursos'))
    .catch(err => console.error('Error de conexion:', err));

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/administrador', administradorRoutes);


module.exports = app;