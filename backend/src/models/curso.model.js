const mongoose = require("mongoose");
const NivelCurso = require("../enums/nivelCurso");
const EstadoContenido = require("../enums/estadoContenido");

const cursoSchema = new mongoose.Schema(
  {
    idCurso: {
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
    precio: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      min: 0,
    },
    duracion: {
      type: String,
      required: true,
      trim: true,
    },
    nivel: {
      type: String,
      enum: Object.values(NivelCurso),
      required: true,
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      required: false,
    },
    imagenPortada: {
      type: String,
      required: false,
      trim: true,
    },
    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
    lecciones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Leccion",
      },
    ],
    estado: {
      type: String,
      enum: Object.values(EstadoContenido),
      default: EstadoContenido.BORRADOR,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

module.exports = mongoose.model("Curso", cursoSchema);
