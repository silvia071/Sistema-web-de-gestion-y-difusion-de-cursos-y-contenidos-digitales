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
    ref: "Usuario",
    required: false
  }
});


// 🔥 Métodos (del UML)

datosFacturacionSchema.methods.actualizarRazonSocial = function(nueva) {
  this.razonSocial = nueva;
};

datosFacturacionSchema.methods.actualizarCuitCuil = function(nuevo) {
  this.cuitCuil = nuevo;
};

datosFacturacionSchema.methods.actualizarDomicilioFiscal = function(nuevo) {
  this.domicilioFiscal = nuevo;
};

datosFacturacionSchema.methods.actualizarCondicionFiscal = function(nueva) {
  this.condicionFiscal = nueva;
};

module.exports = mongoose.model("DatosFacturacion", datosFacturacionSchema);