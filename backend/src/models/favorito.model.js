const mongoose = require("mongoose");

const favoritoSchema = new mongoose.Schema(
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

    fechaAgregado: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

// Evita que un mismo usuario agregue dos veces el mismo curso a favoritos
favoritoSchema.index({ usuario: 1, curso: 1 }, { unique: true });

module.exports = mongoose.model("Favorito", favoritoSchema, "favoritos");
