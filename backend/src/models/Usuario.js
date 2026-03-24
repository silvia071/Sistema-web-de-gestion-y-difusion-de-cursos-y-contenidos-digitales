const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    contrasenia: { type: String, required: true },
    direccion: { type: String },
    telefono: { type: String },
    fechaRegistro: { type: Date, default: Date.now },
    fechaUltimoAcceso: { type: Date },
    estadoCuenta: { 
        type: String, 
        enum: ['ACTIVO', 'INACTIVO', 'BLOQUEADO'], 
        default: 'ACTIVO' 
    },
    rol: { 
        type: String, 
        enum: ['CLIENTE', 'ADMINISTRADOR'], 
        default: 'CLIENTE' 
    },
    datosFacturacion: { type: Object } 
});

UsuarioSchema.methods.cambiarContrasenia = async function(nuevaContrasenia) {
    try {
        const salt = await bcrypt.genSalt(10);
        this.contrasenia = await bcrypt.hash(nuevaContrasenia, salt);
        this.markModified('contrasenia'); 
        return await this.save();
    } catch (error) {
        throw new Error("Error al hashear la nueva contraseña: " + error.message);
    }
};

UsuarioSchema.methods.actualizarDireccion = async function(nuevaDireccion) {
    this.direccion = nuevaDireccion;
    return await this.save();
};

UsuarioSchema.methods.actualizarTelefono = async function(nuevoTelefono) {
    this.telefono = nuevoTelefono;
    return await this.save();
};

UsuarioSchema.methods.actualizarEmail = async function(nuevoEmail) {
    this.email = nuevoEmail;
    return await this.save();
};

UsuarioSchema.methods.esAdministrador = function() {
    return this.rol === 'ADMINISTRADOR';
};

module.exports = mongoose.model('Usuario', UsuarioSchema);

