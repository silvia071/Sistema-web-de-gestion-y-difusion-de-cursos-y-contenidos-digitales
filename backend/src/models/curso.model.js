const mongoose = require("mongoose");
const NivelCurso = require("../enums/nivelCurso");
const EstadoContenido = require("../enums/estadoContenido");

const cursoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
      validate: {
        validator: function (valor) {
          return valor && valor.trim().length > 0;
        },
        message: "El título no puede estar vacío",
      },
    },

    descripcion: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
      validate: {
        validator: function (valor) {
          return valor && valor.trim().length > 0;
        },
        message: "La descripción no puede estar vacía",
      },
    },

    precio: {
      type: Number,
      required: true,
      min: 0.01,
    },

    duracion: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
      validate: {
        validator: function (valor) {
          return valor && valor.trim().length > 0;
        },
        message: "La duración no puede estar vacía",
      },
    },

    nivel: {
      type: String,
      enum: Object.values(NivelCurso),
      required: true,
    },

    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
    },

    imagenPortada: {
      type: String,
      required: false,
      trim: true,
    },
    aprendizajes: [
      {
        type: String,
        trim: true,
      },
    ],

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
