const express = require('express');
const router = express.Router();

const {
    registrarUsuario,
    iniciarSesion,
    cerrarSesion,
    buscarUsuarioPorId,
    buscarUsuarioPorEmail,
    editarPerfil,
    cambiarContrasenia,
    listarUsuarios,
    bloquearUsuario,
    activarUsuario,
    cambiarRol,
    eliminarUsuario,
    actualizarEmail,
    actualizarDireccion,
    actualizarTelefono
} = require('../controllers/usuarioController');

router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);
router.post('/logout/:id', cerrarSesion);
router.get('/:id', buscarUsuarioPorId);
router.get('/buscar-email/:email', buscarUsuarioPorEmail);
router.put('/editar/:id', editarPerfil);
router.put('/cambiar-password/:id', cambiarContrasenia);
router.get('/', listarUsuarios);
router.put('/bloquear/:id', bloquearUsuario);
router.put('/activar/:id', activarUsuario);
router.put('/rol/:id', cambiarRol);
router.delete('/eliminar/:id', eliminarUsuario);
router.patch('/actualizar-email/:id', actualizarEmail);
router.patch('/actualizar-direccion/:id', actualizarDireccion);
router.patch('/actualizar-telefono/:id', actualizarTelefono);

module.exports = router;
