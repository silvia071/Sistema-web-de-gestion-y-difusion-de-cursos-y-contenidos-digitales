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
} = require('../controllers/usuarioController');


router.post('/registro', registrarUsuario);
router.post('/login', iniciarSesion);
router.post('/logout/:id', cerrarSesion);


router.get('/', listarUsuarios);
router.get('/:id', buscarUsuarioPorId);
router.get('/email/:email', buscarUsuarioPorEmail);


router.put('/perfil/:id', editarPerfil);
router.put('/password/:id', cambiarContrasenia);
router.put('/rol/:id', cambiarRol);
router.put('/bloquear/:id', bloquearUsuario);
router.put('/activar/:id', activarUsuario);

router.patch('/email/:id', actualizarEmail);
router.patch('/direccion/:id', actualizarDireccion);
router.patch('/telefono/:id', actualizarTelefono);


router.delete('/:id', eliminarUsuario);

module.exports = router;

