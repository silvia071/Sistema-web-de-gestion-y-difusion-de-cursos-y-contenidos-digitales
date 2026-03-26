const mongoose = require("mongoose");
const EstadoContenido = require("../enums/estadoContenido");

const leccionSchema = new mongoose.Schema(
  {
    idLeccion: {
      type: Number,
      required: true,
      unique: true,
    },
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    contenido: {
      type: String,
      required: true,
      trim: true,
    },
    duracionMinutos: {
      type: Number,
      required: true,
      min: 1,
    },
    orden: {
      type: Number,
      required: true,
      min: 1,
    },
    estado: {
      type: String,
      enum: Object.values(EstadoContenido),
      default: EstadoContenido.BORRADOR,
    },
    curso: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Curso",
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

module.exports = mongoose.model("Leccion", leccionSchema);
