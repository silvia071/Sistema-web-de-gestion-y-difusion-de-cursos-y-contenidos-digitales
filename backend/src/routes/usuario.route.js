const express = require('express');
const router = express.Router();

const {
    registrarUsuario,
    iniciarSesion,
    cerrarSesion,
    listarUsuarios,
    buscarUsuarioPorId,
    buscarUsuarioPorEmail,
    editarPerfil,
    cambiarContrasenia,
    eliminarUsuario,
    bloquearUsuario,
    activarUsuario,
    cambiarRol,
    actualizarEmail,
    actualizarDireccion,
    actualizarTelefono
} = require('../controllers/usuario.controller');

const { 
    validarRegistro, 
    validarLogin, 
    validarId,
    validarCambioRol
} = require('../middlewares/usuario.validator');

router.post('/registro', validarRegistro, registrarUsuario);
router.post('/login', validarLogin, iniciarSesion);
router.post('/logout/:id', validarId, cerrarSesion);

router.get('/', listarUsuarios);
router.get('/:id', validarId, buscarUsuarioPorId);
router.get('/email/:email', buscarUsuarioPorEmail);

router.put('/perfil/:id', validarId, editarPerfil);
router.put('/password/:id', validarId, cambiarContrasenia);
router.put('/bloquear/:id', validarId, bloquearUsuario);
router.put('/activar/:id', validarId, activarUsuario);
router.put('/rol/:id', validarId, validarCambioRol, cambiarRol);

router.patch('/email/:id', validarId, actualizarEmail);
router.patch('/direccion/:id', validarId, actualizarDireccion);
router.patch('/telefono/:id', validarId, actualizarTelefono);

router.delete('/:id', validarId, eliminarUsuario);

module.exports = router;



