const mongoose = require("mongoose");

const datosFacturacionSchema = new mongoose.Schema({
  razonSocial: {
    type: String,
    required: true
  },
  cuitCuil: {
    type: String,
    required: true,
    match: /^\d{11}$/
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
}, { timestamps: true });


// 🔥 Métodos

datosFacturacionSchema.methods.actualizarRazonSocial = async function(nueva) {
  this.razonSocial = nueva;
  return await this.save();
};

datosFacturacionSchema.methods.actualizarCuitCuil = async function(nuevo) {
  this.cuitCuil = nuevo;
  return await this.save();
};

datosFacturacionSchema.methods.actualizarDomicilioFiscal = async function(nuevo) {
  this.domicilioFiscal = nuevo;
  return await this.save();
};

datosFacturacionSchema.methods.actualizarCondicionFiscal = async function(nueva) {
  this.condicionFiscal = nueva;
  return await this.save();
};

module.exports = mongoose.model("DatosFacturacion", datosFacturacionSchema);