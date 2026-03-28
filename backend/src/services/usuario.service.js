const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');

const registrarUsuario = async (datos) => {
    if (!datos.contrasenia) {
        throw new Error("La contraseña es obligatoria");
    }

    const salt = await bcrypt.genSalt(10);
    datos.contrasenia = await bcrypt.hash(datos.contrasenia, salt);
    
    const nuevoUsuario = new Usuario(datos);
    return await nuevoUsuario.save();
};
const iniciarSesion = async (email, contrasenia) => {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) throw new Error("Usuario no encontrado");

    const esValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!esValida) throw new Error("Contraseña incorrecta");

    usuario.fechaUltimoAcceso = new Date();
    await usuario.save();
    return usuario;
};

const cerrarSesion = async (id) => {
    const usuario = await Usuario.findOne({ idUsuario: id });
    if (!usuario) throw new Error("Usuario no encontrado");

    return { 
        mensaje: `Sesión cerrada para el usuario ${usuario.nombre}`, 
        idUsuario: usuario.idUsuario 
    };
};

const listarUsuarios = async () => {
    return await Usuario.find();
};

const buscarUsuarioPorId = async (id) => {
    return await Usuario.findOne({ idUsuario: id });
};

const buscarUsuarioPorEmail = async (email) => {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) throw new Error("No se encontró ningún usuario con ese email");
    return usuario;
};


const editarPerfil = async (id, datosActualizados) => {
    return await Usuario.findOneAndUpdate(
        { idUsuario: id },
        datosActualizados,
        { new: true, runValidators: true }
    );
};

const cambiarContrasenia = async (id, datos) => {
    const usuario = await Usuario.findOne({ idUsuario: id });
    if (!usuario) throw new Error("Usuario no encontrado");

    return await usuario.cambiarContrasenia(datos.contrasenia); 
};


const eliminarUsuario = async (id) => {
    return await Usuario.findOneAndDelete({ idUsuario: id });
};

const bloquearUsuario = async (id) => {
    return await Usuario.findOneAndUpdate(
        { idUsuario: id },
        { estadoCuenta: 'BLOQUEADO' },
        { new: true }
    );
};

const activarUsuario = async (id) => {
    return await Usuario.findOneAndUpdate(
        { idUsuario: id },
        { estadoCuenta: 'ACTIVO' },
        { new: true }
    );
};

const cambiarRol = async (id, nuevoRol) => {
    return await Usuario.findOneAndUpdate(
        { idUsuario: id },
        { rol: nuevoRol },
        { new: true }
    );
};

const actualizarEmail = async (id, nuevoEmail) => {
    return await Usuario.findOneAndUpdate(
        { idUsuario: id },
        { email: nuevoEmail },
        { new: true, runValidators: true }
    );
};

const actualizarDireccion = async (id, nuevaDireccion) => {
    const usuario = await Usuario.findOneAndUpdate(
        { idUsuario: id },
        { direccion: nuevaDireccion },
        { new: true, runValidators: true }
    );

    if (!usuario) {
        throw new Error("No se encontró el usuario para actualizar la dirección");
    }

    return usuario;
};

const actualizarTelefono = async (id, nuevoTelefono) => {
    const usuario = await Usuario.findOneAndUpdate(
        { idUsuario: id },
        { telefono: nuevoTelefono },
        { new: true, runValidators: true }
    );

    if (!usuario) {
        throw new Error("No se encontró el usuario para actualizar el teléfono");
    }

    return usuario;
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
