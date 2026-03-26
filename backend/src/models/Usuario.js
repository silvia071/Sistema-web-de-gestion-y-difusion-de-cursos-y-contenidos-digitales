const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Counter = require('./Counter');
const EstadoCuenta = require('../enums/EstadoCuenta');
const RolUsuario = require('../enums/RolUsuario');

const UsuarioSchema = new mongoose.Schema({
    idUsuario: { type: Number, unique: true }, 
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
        enum: Object.values(EstadoCuenta), 
        default: 'ACTIVO' 
    },
    rol: { 
        type: String, 
        enum: Object.values(RolUsuario), 
        default: 'CLIENTE' 
    },
    datosFacturacion: { type: Object } 
});

UsuarioSchema.pre('save', async function() { 
    if (!this.isNew) return; 

    try {
        const counter = await Counter.findOneAndUpdate(
            { id: 'usuarioId' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.idUsuario = counter.seq;
       
    } catch (error) {
        throw error; 
    }
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

UsuarioSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);

