const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt');

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
    const emailLimpio = email.trim().toLowerCase();
    const usuario = await Usuario.findOne({ email: emailLimpio });

    if (!usuario) throw new Error("Usuario no encontrado");

    const esValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
    if (!esValida) throw new Error("Contraseña incorrecta");

    usuario.fechaUltimoAcceso = new Date();
    await usuario.save();
    
    return usuario;
};

const cerrarSesion = async (id) => {
    const usuario = await Usuario.findById(id);
    if (!usuario) throw new Error("Usuario no encontrado");

    return { 
        mensaje: `Sesión cerrada para el usuario ${usuario.nombre}`, 
        id: usuario._id 
    };
};

const listarUsuarios = async () => {
    return await Usuario.find();
};

const buscarUsuarioPorId = async (id) => {
    return await Usuario.findById(id);
};

const buscarUsuarioPorEmail = async (email) => {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) throw new Error("No se encontró ningún usuario con ese email");
    return usuario;
};

const editarPerfil = async (id, datosActualizados) => {
    return await Usuario.findByIdAndUpdate(
        id,
        datosActualizados,
        { returnDocument: 'after', runValidators: true }
    );
};

const cambiarContrasenia = async (id, datos) => {
    const usuario = await Usuario.findById(id);
    if (!usuario) throw new Error("Usuario no encontrado");

    const passwordParaHashear = datos.nuevaContrasenia || datos.contrasenia;
    if (!passwordParaHashear) throw new Error("La nueva contraseña es requerida");

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(passwordParaHashear, salt);
    
    usuario.contrasenia = hash;
    return await usuario.save();
};

const eliminarUsuario = async (id) => {
    return await Usuario.findByIdAndDelete(id);
};

const bloquearUsuario = async (id) => {
    return await Usuario.findByIdAndUpdate(
        id,
        { estadoCuenta: 'BLOQUEADO' },
        { returnDocument: 'after' }
    );
};

const activarUsuario = async (id) => {
    return await Usuario.findByIdAndUpdate(
        id,
        { estadoCuenta: 'ACTIVO' },
        { returnDocument: 'after' }
    );
};

const cambiarRol = async (id, nuevoRol) => {
    return await Usuario.findByIdAndUpdate(
        id,
        { rol: nuevoRol },
        { returnDocument: 'after', runValidators: true } 
    );
};

const actualizarEmail = async (id, nuevoEmail) => {
    return await Usuario.findByIdAndUpdate(
        id,
        { email: nuevoEmail },
        { returnDocument: 'after', runValidators: true }
    );
};

const actualizarDireccion = async (id, nuevaDireccion) => {
    const usuario = await Usuario.findByIdAndUpdate(
        id,
        { direccion: nuevaDireccion },
        { returnDocument: 'after', runValidators: true }
    );

    if (!usuario) {
        throw new Error("No se encontró el usuario para actualizar la dirección");
    }

    return usuario;
};

const actualizarTelefono = async (id, nuevoTelefono) => {
    const usuario = await Usuario.findByIdAndUpdate(
        id,
        { telefono: nuevoTelefono },
        { returnDocument: 'after', runValidators: true }
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

