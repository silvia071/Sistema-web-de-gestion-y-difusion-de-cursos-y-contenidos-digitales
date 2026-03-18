const mongoose = require('mongoose');

const administradorSchema = new mongoose.Schema({
   
    usuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    
    
    idAdministrador: {
        type: Number,
        unique: true
    },

    
    rolAdmin: { 
        type: String, 
        default: 'ADMIN' 
    },
    
    
    permisos: [{ 
        type: String 
    }],
    

    ultimoAcceso: { 
        type: Date 
    }
}, {
    timestamps: false
});

module.exports = mongoose.model('Administrador', administradorSchema);
