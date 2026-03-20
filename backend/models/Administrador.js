const mongoose = require('mongoose');

const AdministradorSchema = new mongoose.Schema({
    idUsuario: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Usuario', 
        required: true 
    },
    idAdministrador: { type: Number },
    rolAdmin: { type: String, default: 'ADMIN' },
    permisos: [{ type: String }],
    ultimoAcceso: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Administrador', AdministradorSchema);
