const mongoose = require("mongoose");

const datosFacturacionSchema = new mongoose.Schema({
  razonSocial: {
    type: String,
    required: true
  },
  cuitCuil: {
    type: String,
    required: true
  },
  condicionFiscal: {
    type: String,
    required: true
  },
  domicilioFiscal: {
    type: String,
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario"
  }
});

module.exports = mongoose.model("DatosFacturacion", datosFacturacionSchema);