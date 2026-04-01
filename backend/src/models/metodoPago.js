const mongoose = require("mongoose");

const options = {
  discriminatorKey: "tipo",
  collection: "metodosPago",
  timestamps: true
};

const metodoPagoSchema = new mongoose.Schema({
  titular: {
    type: String,
    required: true,
    trim: true
  }
}, options);

// 🔥 Método común a todos los métodos de pago
metodoPagoSchema.methods.obtenerTipo = function() {
  return this.tipo;
};

const MetodoPago = mongoose.model("MetodoPago", metodoPagoSchema);

module.exports = MetodoPago;