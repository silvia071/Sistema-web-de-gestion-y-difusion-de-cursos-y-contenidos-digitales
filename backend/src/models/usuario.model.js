const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); 
const EstadoCuenta = require('../enums/estadoCuenta');
const RolUsuario = require('../enums/rolUsuario');

const UsuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    contrasenia: { type: String, required: true },
    direccion: { type: String },
    telefono: { type: String },
    fechaRegistro: { type: Date, default: Date.now },
    fechaUltimoAcceso: { type: Date },
    estadoCuenta: { 
        type: String, 
        enum: Object.values(EstadoCuenta), 
        default: EstadoCuenta.ACTIVO 
    },
    rol: { 
        type: String, 
        enum: Object.values(RolUsuario), 
        default: RolUsuario.CLIENTE 
    },
    datosFacturacion: { type: Object } 
}, { timestamps: true }); 

UsuarioSchema.methods.cambiarContrasenia = async function(hashContrasenia) {
    this.contrasenia = hashContrasenia;
    return await this.save();
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
    return this.rol === RolUsuario.ADMINISTRADOR;
};

UsuarioSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        delete ret.contrasenia;
        return ret;
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);

