const Usuario = require('../models/Usuario');
const Administrador = require('../models/Administrador');
const bcrypt = require('bcryptjs');

exports.registrarse = async (req, res) => {
    try {
        const { nombre, apellido, email, contraseña, direccion, telefono } = req.body;

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: "El email ya está registrado" });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHasheada = await bcrypt.hash(contraseña, salt);

        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            email,
            contraseña: passwordHasheada,
            direccion,
            telefono,
            fechaRegistro: new Date(),
            estadoCuenta: 'activo' 
        });

        await nuevoUsuario.save();
        res.status(201).json({ mensaje: "Usuario registrado con éxito", id: nuevoUsuario._id });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el registro", error: error.message });
    }
};

exports.iniciarSesion = async (req, res) => {
    try {
        const { email, contraseña } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        if (usuario.estadoCuenta === 'bloqueado') {
            return res.status(403).json({ mensaje: "Tu cuenta está bloqueada" });
        }

        const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esValida) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        usuario.fechaUltimoAcceso = new Date();
        await usuario.save();

        const adminInfo = await Administrador.findOne({ usuario: usuario._id });

        res.status(200).json({
            mensaje: "Login exitoso",
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: adminInfo ? 'ADMIN' : 'USUARIO',
                permisos: adminInfo ? adminInfo.permisos : []
            }
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", error: error.message });
    }
};

exports.editarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizaciones = req.body;

        if (actualizaciones.contraseña) {
            const salt = await bcrypt.genSalt(10);
            actualizaciones.contraseña = await bcrypt.hash(actualizaciones.contraseña, salt);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(id, actualizaciones, { new: true });
        res.status(200).json({ mensaje: "Perfil actualizado", usuario: usuarioActualizado });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al editar perfil", error: error.message });
    }
};
