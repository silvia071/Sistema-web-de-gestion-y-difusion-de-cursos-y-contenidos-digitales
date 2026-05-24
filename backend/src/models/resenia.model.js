const mongoose = require("mongoose");

const reseniaSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },

    curso: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Curso",
      required: true,
    },

    puntaje: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comentario: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500,
    },

    fechaCreacion: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

reseniaSchema.index({ usuario: 1, curso: 1 }, { unique: true });

module.exports = mongoose.model("Resenia", reseniaSchema, "resenias");
