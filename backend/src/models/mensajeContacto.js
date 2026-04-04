const mongoose = require("mongoose");

const mensajeContactoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  asunto: {
    type: String,
    required: true,
    trim: true
  },
  contenido: {
    type: String,
    required: true
  },
  fechaEnvio: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ["NO_LEIDO", "LEIDO", "RESPONDIDO", "ELIMINADO"],
    default: "NO_LEIDO"
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  }
}, { timestamps: true });


// 🔥 Métodos

mensajeContactoSchema.methods.marcarComoLeido = async function() {
  this.estado = "LEIDO";
  return await this.save();
};

mensajeContactoSchema.methods.responder = async function() {
  this.estado = "RESPONDIDO";
  return await this.save();
};

mensajeContactoSchema.methods.eliminar = async function() {
  this.estado = "ELIMINADO";
  return await this.save();
};

module.exports = mongoose.model("MensajeContacto", mensajeContactoSchema);