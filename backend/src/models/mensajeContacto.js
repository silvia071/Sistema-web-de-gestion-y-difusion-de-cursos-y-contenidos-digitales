const mongoose = require("mongoose");

const mensajeContactoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  asunto: {
    type: String,
    required: true
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
    ref: "Usuario",
    required: false
  }
});

module.exports = mongoose.model("MensajeContacto", mensajeContactoSchema);