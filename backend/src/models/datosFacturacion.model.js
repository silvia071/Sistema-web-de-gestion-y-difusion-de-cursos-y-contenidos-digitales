const mongoose = require("mongoose");

const datosFacturacionSchema = new mongoose.Schema({
  idDatosFacturacion: Number,
  razonSocial: String,
  cuitCuil: String,
  condicionFiscal: String,
  domicilioFiscal: String
});


// 🔹 MÉTODOS (como pide el UML)

datosFacturacionSchema.methods.actualizarRazonSocial = function (nuevaRazonSocial) {
  this.razonSocial = nuevaRazonSocial;
};

datosFacturacionSchema.methods.actualizarCuitCuil = function (nuevoCuitCuil) {
  this.cuitCuil = nuevoCuitCuil;
};

datosFacturacionSchema.methods.actualizarCondicionFiscal = function (nuevaCondicionFiscal) {
  this.condicionFiscal = nuevaCondicionFiscal;
};

datosFacturacionSchema.methods.actualizarDomicilioFiscal = function (nuevoDomicilio) {
  this.domicilioFiscal = nuevoDomicilio;
};

datosFacturacionSchema.methods.mostrarDatos = function () {
  return {
    razonSocial: this.razonSocial,
    cuitCuil: this.cuitCuil,
    condicionFiscal: this.condicionFiscal,
    domicilioFiscal: this.domicilioFiscal
  };
};

module.exports = mongoose.model("DatosFacturacion", datosFacturacionSchema);