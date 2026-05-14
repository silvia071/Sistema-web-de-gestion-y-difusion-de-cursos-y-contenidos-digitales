const mongoose = require("mongoose");

const datosFacturacionSchema = new mongoose.Schema(
  {
    razonSocial: {
      type: String,
      required: true,
      trim: true,
    },
    cuitCuil: {
      type: String,
      required: true,
      trim: true,
    },
    condicionFiscal: {
      type: String,
      required: true,
      trim: true,
    },
    domicilioFiscal: {
      type: String,
      required: true,
      trim: true,
    },
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("DatosFacturacion", datosFacturacionSchema);
