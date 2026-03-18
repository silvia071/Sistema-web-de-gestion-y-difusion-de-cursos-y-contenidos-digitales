const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    
    nombre: { 
        type: String, 
        required: true 
    },
    apellido: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true
    },
    contraseña: { 
        type: String, 
        required: true 
    }, // Se guardará hasheada con bcrypt 
    
    direccion: { 
        type: String 
    },
    telefono: { 
        type: String 
    },
    
    fechaRegistro: { 
        type: Date, 
        default: Date.now 
    },
    fechaUltimoAcceso: { 
        type: Date 
    },
    
    
    estadoCuenta: { 
        type: String, 
        enum: ['activo', 'inactivo', 'bloqueado'], 
        default: 'activo' 
    },

    
    historialCompras: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Compra'
    }],
    
    datosFacturacion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DatosFacturacion'
    }
}, {
    timestamps: false 

});

module.exports = mongoose.model('Usuario', usuarioSchema);

