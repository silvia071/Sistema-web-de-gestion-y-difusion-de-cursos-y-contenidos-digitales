const mongoose = require("mongoose");
const EstadoMensaje = require("../enums/estadoMensaje");

const mensajeSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    asunto: {
      type: String,
      trim: true,
      default: "Consulta desde formulario de contacto",
    },

    contenido: {
      type: String,
      required: true,
      trim: true,
    },

    fechaEnvio: {
      type: Date,
      default: Date.now,
    },

    estado: {
      type: String,
      enum: Object.values(EstadoMensaje),
      default: EstadoMensaje.NO_LEIDO,
    },

    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },

    respuestaAdmin: {
      type: String,
      trim: true,
      default: "",
    },

    fechaRespuesta: {
      type: Date,
      default: null,
    },

    respondidoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("MensajeContacto", mensajeSchema);
