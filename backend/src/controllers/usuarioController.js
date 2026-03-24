const usuarioService = require('../models/UsuarioService');

exports.registrarUsuario = async (req, res) => {
    try {
        const usuario = await usuarioService.registrarUsuario(req.body);
        res.status(201).json(usuario);
    } catch (error) {
        res.status(400).json({ mensaje: "Error al registrar", error: error.message });
    }
};

exports.iniciarSesion = async (req, res) => {
    try {
        const { email, contrasenia } = req.body;
        const usuario = await usuarioService.iniciarSesion(email, contrasenia);
        res.status(200).json({ mensaje: "Login exitoso", usuario });
    } catch (error) {
        res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }
};

exports.cerrarSesion = async (req, res) => {
    try {
        const resultado = await usuarioService.cerrarSesion(req.params.id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al cerrar sesión", error: error.message });
    }
};

exports.listarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuarioService.listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener usuarios" });
    }
};

exports.buscarUsuarioPorId = async (req, res) => {
    try {
        const usuario = await usuarioService.buscarUsuarioPorId(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json({ mensaje: "ID inválido" });
    }
};

exports.buscarUsuarioPorEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const usuario = await usuarioService.buscarUsuarioPorEmail(email);
        
        if (!usuario) {
            return res.status(404).json({ mensaje: "No existe un usuario con ese email" });
        }
        
        res.status(200).json(usuario);
    } catch (error) {
        res.status(400).json({ mensaje: "Error en la búsqueda", error: error.message });
    }
};

exports.editarPerfil = async (req, res) => {
    try {
        const usuario = await usuarioService.editarPerfil(req.params.id, req.body);
        res.status(200).json({ mensaje: "Perfil actualizado", usuario });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar", error: error.message });
    }
};

exports.cambiarContrasenia = async (req, res) => {
    try {
        const { nuevaContrasenia } = req.body;
        const usuario = await usuarioService.buscarUsuarioPorId(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });
        
        await usuario.cambiarContrasenia(nuevaContrasenia);
        res.status(200).json({ mensaje: "Contraseña actualizada con éxito" });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al cambiar contraseña", detalle: error.message });
    }
};

exports.eliminarUsuario = async (req, res) => {
    try {
        await usuarioService.eliminarUsuario(req.params.id);
        res.status(200).json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al eliminar" });
    }
};

exports.bloquearUsuario = async (req, res) => {
    try {
        const usuario = await usuarioService.bloquearUsuario(req.params.id);
        res.status(200).json({ mensaje: "Usuario bloqueado", usuario });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al bloquear" });
    }
};

exports.activarUsuario = async (req, res) => {
    try {
        const usuario = await usuarioService.activarUsuario(req.params.id);
        res.status(200).json({ mensaje: "Usuario activado", usuario });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al activar" });
    }
};

exports.cambiarRol = async (req, res) => {
    try {
        const { nuevoRol } = req.body;
        const usuario = await usuarioService.cambiarRol(req.params.id, nuevoRol);
        res.status(200).json({ mensaje: "Rol actualizado", usuario });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al cambiar rol" });
    }
};

exports.actualizarEmail = async (req, res) => {
    try {
        const { nuevoEmail } = req.body;
        const usuario = await usuarioService.buscarUsuarioPorId(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        await usuario.actualizarEmail(nuevoEmail);
        res.status(200).json({ mensaje: "Email actualizado correctamente", email: usuario.email });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar email", detalle: error.message });
    }
};

exports.actualizarDireccion = async (req, res) => {
    try {
        const { nuevaDireccion } = req.body;
        const usuario = await usuarioService.buscarUsuarioPorId(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        await usuario.actualizarDireccion(nuevaDireccion);
        res.status(200).json({ mensaje: "Dirección actualizada correctamente", direccion: usuario.direccion });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar dirección", detalle: error.message });
    }
};

exports.actualizarTelefono = async (req, res) => {
    try {
        const { nuevoTelefono } = req.body;
        const usuario = await usuarioService.buscarUsuarioPorId(req.params.id);
        if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

        await usuario.actualizarTelefono(nuevoTelefono);
        res.status(200).json({ mensaje: "Teléfono actualizado correctamente", telefono: usuario.telefono });
    } catch (error) {
        res.status(400).json({ mensaje: "Error al actualizar teléfono", detalle: error.message });
    }

};
