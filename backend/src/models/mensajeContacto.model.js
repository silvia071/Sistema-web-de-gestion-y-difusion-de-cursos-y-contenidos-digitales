const mongoose = require("mongoose");
const EstadoMensaje = require("../enums/estadoMensaje");

const mensajeSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  asunto: String,
  contenido: String,
  fechaEnvio: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: Object.values(EstadoMensaje),
    default: EstadoMensaje.NO_LEIDO
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  }
});

module.exports = mongoose.model("MensajeContacto", mensajeSchema);