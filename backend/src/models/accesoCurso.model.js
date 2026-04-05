const mongoose = require("mongoose");

const accesoCursoSchema = new mongoose.Schema(
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
    compra: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Compra",
      required: true,
    },
    fechaAcceso: {
      type: Date,
      default: Date.now,
    },
    estado: {
      type: String,
      enum: ["ACTIVO", "REVOCADO"],
      default: "ACTIVO",
    },
    progreso: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    versionKey: false,
  },
);

accesoCursoSchema.index({ usuario: 1, curso: 1 }, { unique: true });

module.exports = mongoose.model("AccesoCurso", accesoCursoSchema);
