const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rutas para Persona 1
router.post('/registro', usuarioController.registrarse);
router.post('/login', usuarioController.iniciarSesion);
router.put('/perfil/:id', usuarioController.editarPerfil);

module.exports = router;