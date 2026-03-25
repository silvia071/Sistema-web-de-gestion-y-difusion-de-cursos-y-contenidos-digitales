const Usuario = require('./Usuario');
const bcrypt = require('bcryptjs');
const EstadoCuenta = require('../enums/EstadoCuenta');
const RolUsuario = require('../enums/RolUsuario');

class UsuarioService {
    
    async registrarUsuario(datos) {
        const salt = await bcrypt.genSalt(10);
        datos.contrasenia = await bcrypt.hash(datos.contrasenia, salt);
        const nuevoUsuario = new Usuario(datos);
        return await nuevoUsuario.save();
    }  

    async iniciarSesion(email, contrasenia) {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) throw new Error('Credenciales incorrectas');
        
        if (usuario.estadoCuenta === EstadoCuenta.BLOQUEADO) {
            throw new Error('Tu cuenta está bloqueada. Contacta al administrador.');
        }

        const esValida = await bcrypt.compare(contrasenia, usuario.contrasenia);
        if (!esValida) throw new Error('Credenciales incorrectas');
        
        usuario.fechaUltimoAcceso = new Date();
        await usuario.save();
        return usuario;
    }

    async cerrarSesion(id) {
        return { mensaje: "Sesión cerrada correctamente" };
    }

    async editarPerfil(id, nuevosDatos) {
    if (nuevosDatos.contrasenia) {
        const salt = await bcrypt.genSalt(10);
        nuevosDatos.contrasenia = await bcrypt.hash(nuevosDatos.contrasenia, salt);
    }
    return await Usuario.findByIdAndUpdate(id, nuevosDatos, { returnDocument: 'after' });
    }

    async cambiarContrasenia(id, nuevaContrasenia) {
        const usuario = await Usuario.findById(id);
        if (!usuario) throw new Error("Usuario no encontrado");
        await usuario.cambiarContrasenia(nuevaContrasenia);
        return usuario;
    }

    async eliminarUsuario(id) {
        return await Usuario.findByIdAndDelete(id);
    }

    async listarUsuarios() {
        return await Usuario.find();
    }

    async buscarUsuarioPorId(id) {
        return await Usuario.findById(id);
    }

    async buscarUsuarioPorEmail(email) {
        return await Usuario.findOne({ email });
    }

    async cambiarRol(id, nuevoRol) {
        if (!Object.values(RolUsuario).includes(nuevoRol)) {
            throw new Error('Rol no válido');
        }
        return await Usuario.findByIdAndUpdate(id, { rol: nuevoRol }, { new: true });
    }

    async bloquearUsuario(id) {
        return await Usuario.findByIdAndUpdate(
            id, 
            { estadoCuenta: EstadoCuenta.BLOQUEADO }, 
            { new: true }
        );
    }

    async activarUsuario(id) {
        return await Usuario.findByIdAndUpdate(
            id, 
            { estadoCuenta: EstadoCuenta.ACTIVO }, 
            { new: true }
        );
    }
}

module.exports = new UsuarioService();

