const usuarioService = require('../services/usuario.service');


const registrarUsuario = async (req, res) => {
    try {
        console.log("--> Intentando registrar a:", req.body.email);
        const usuario = await usuarioService.registrarUsuario(req.body);
        return res.status(201).json(usuario);
    } catch (error) {
        console.error("--> ERROR REAL:", error.message);
        return res.status(400).json({ 
            error: "Error en el registro", 
            detalle: error.message 
        });
    }
};

const iniciarSesion = async (req, res) => {
    try {
        const { email, contrasenia } = req.body;
        const usuario = await usuarioService.iniciarSesion(email, contrasenia);
        res.status(200).json({ mensaje: "Login exitoso", usuario });
    } catch (error) {
        res.status(401).json({ mensaje: error.message });
    }
};

const cerrarSesion = async (req, res) => {
    try {
        const resultado = await usuarioService.cerrarSesion(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al cerrar sesión", error: error.message });
    }
};

const listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuarios" });
    }
};

const buscarUsuarioPorId = async (req, res) => {
    try {
        const usuario = await usuarioService.buscarUsuarioPorId(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json({ mensaje: "ID inválido" });
    }
};

const buscarUsuarioPorEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const usuario = await usuarioService.buscarUsuarioPorEmail(email);
        if (!usuario) return res.status(404).json({ mensaje: "No existe un usuario con ese email" });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json({ mensaje: "Error en la búsqueda", error: error.message });
    }
};

const editarPerfil = async (req, res) => {
    try {
        const { id } = req.params; 
        const datosActualizados = req.body;

        const usuario = await usuarioService.editarPerfil(id, datosActualizados);

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        res.status(200).json({
            mensaje: "Perfil actualizado correctamente",
            usuario
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al editar perfil", error: error.message });
    }
};

const cambiarContrasenia = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await usuarioService.cambiarContrasenia(id, req.body);
        res.status(200).json({ mensaje: "¡Contraseña actualizada!" });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al cambiar contraseña", detalle: error.message });
    }
};

const eliminarUsuario = async (req, res) => {
    try {
        await usuarioService.eliminarUsuario(req.params.id);
        res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al eliminar" });
    }
};

const bloquearUsuario = async (req, res) => {
    try {
        const usuario = await usuarioService.bloquearUsuario(req.params.id);
        res.status(200).json({ mensaje: "Usuario bloqueado con éxito", usuario });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al bloquear", detalle: error.message });
    }
};

const activarUsuario = async (req, res) => {
    try {
        const usuario = await usuarioService.activarUsuario(req.params.id);
        res.status(200).json({ mensaje: "Usuario activado con éxito", usuario });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al activar", detalle: error.message });
    }
};

const cambiarRol = async (req, res) => {
    try {
        const { nuevoRol } = req.body;
        const usuario = await usuarioService.cambiarRol(req.params.id, nuevoRol);
        res.status(200).json({ mensaje: "Rol actualizado", usuario });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al cambiar rol", detalle: error.message });
    }
};

const actualizarEmail = async (req, res) => {
    try {
        const { nuevoEmail } = req.body;
        const usuario = await usuarioService.actualizarEmail(req.params.id, nuevoEmail);
        res.status(200).json({ mensaje: "Email actualizado correctamente", usuario });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar email", detalle: error.message });
    }
};

const actualizarDireccion = async (req, res) => {
    try {
        const { nuevaDireccion } = req.body;
        const usuario = await usuarioService.actualizarDireccion(req.params.id, nuevaDireccion);
        res.status(200).json({ mensaje: "Dirección actualizada correctamente", usuario });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar dirección", detalle: error.message });
    }
};

const actualizarTelefono = async (req, res) => {
    try {
        const { nuevoTelefono } = req.body;
        const usuario = await usuarioService.actualizarTelefono(req.params.id, nuevoTelefono);
        res.status(200).json({ mensaje: "Teléfono actualizado correctamente", usuario });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar teléfono", detalle: error.message });
    }
};

module.exports = {
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
};




