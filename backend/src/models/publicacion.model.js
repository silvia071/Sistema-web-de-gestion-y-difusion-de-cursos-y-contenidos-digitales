const mongoose = require("mongoose");

const publicacionSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    contenido: {
      type: String,
      required: true,
      trim: true,
    },
    estado: {
      type: String,
      enum: ["BORRADOR", "PUBLICADO", "OCULTO"],
      default: "BORRADOR",
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
module.exports = mongoose.model("Publicacion", publicacionSchema);
