const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

router.post('/registro', usuarioController.registrarUsuario);
router.post('/login', usuarioController.iniciarSesion);
router.post('/logout/:id', usuarioController.cerrarSesion);
router.get('/:id', usuarioController.buscarUsuarioPorId);
router.get('/buscar-email/:email', usuarioController.buscarUsuarioPorEmail);
router.put('/editar/:id', usuarioController.editarPerfil);
router.put('/cambiar-password/:id', usuarioController.cambiarContrasenia);
router.get('/', usuarioController.listarUsuarios);
router.put('/bloquear/:id', usuarioController.bloquearUsuario);
router.put('/activar/:id', usuarioController.activarUsuario);
router.put('/rol/:id', usuarioController.cambiarRol);
router.delete('/eliminar/:id', usuarioController.eliminarUsuario);
router.patch('/actualizar-email/:id', usuarioController.actualizarEmail);
router.patch('/actualizar-direccion/:id', usuarioController.actualizarDireccion);
router.patch('/actualizar-telefono/:id', usuarioController.actualizarTelefono);

module.exports = router;
