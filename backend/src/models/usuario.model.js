const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Counter = require('./counter.model'); 
const EstadoCuenta = require('../enums/estadoCuenta');
const RolUsuario = require('../enums/rolUsuario');

const UsuarioSchema = new mongoose.Schema({
    idUsuario: { type: Number, unique: true }, 
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

UsuarioSchema.pre('save', async function() { 
    if (!this.isNew) return; 

    try {
        const counter = await Counter.findOneAndUpdate(
            { id: 'usuarioId' },
            { $inc: { seq: 1 } },
            { returnDocument: 'after', upsert: true }
        );
        this.idUsuario = counter.seq;
    } catch (error) {
        throw error;
    }
});

UsuarioSchema.methods.cambiarContrasenia = async function(nuevaContrasenia) {
    const salt = await bcrypt.genSalt(10);
    this.contrasenia = await bcrypt.hash(nuevaContrasenia, salt);
    this.markModified('contrasenia'); 
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
        delete ret._id;
        delete ret.__v;
        delete ret.contrasenia;
        return ret;
    }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);
