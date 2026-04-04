const mongoose = require("mongoose");
const MetodoPago = require("./metodoPago");

const tarjetaSchema = new mongoose.Schema({
  numeroTarjeta: {
    type: String,
    required: true,
    trim: true,
    match: /^\d{13,19}$/ // valida longitud típica de tarjetas
  },
  fechaVencimiento: {
    type: String,
    required: true,
    match: /^(0[1-9]|1[0-2])\/\d{2}$/ // formato MM/YY
  },
  codigoSeguridad: {
    type: String,
    required: true,
    match: /^\d{3,4}$/ // CVV
  },
  tipoTarjeta: {
    type: String,
    enum: ["VISA", "MASTERCARD", "AMEX", "OTRA"],
    required: true
  }
});

// 🔥 Método útil
tarjetaSchema.methods.obtenerUltimos4 = function () {
  return this.numeroTarjeta.slice(-4);
};

const Tarjeta = MetodoPago.discriminator("TARJETA", tarjetaSchema);

module.exports = Tarjeta;