const mongoose = require("mongoose");
const EstadoContenido = require("../enums/estadoContenido");

const leccionSchema = new mongoose.Schema(
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
      maxlength: 500,
      validate: {
        validator: function (valor) {
          return valor && valor.trim().length > 0;
        },
        message: "La descripción no puede estar vacía",
      },
    },

    contenido: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      validate: {
        validator: function (valor) {
          return valor && valor.trim().length > 0;
        },
        message: "El contenido no puede estar vacío",
      },
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
