const mongoose = require("mongoose");
const MetodoPago = require("./metodoPago");

const transferenciaSchema = new mongoose.Schema({
  bancoEmisor: {
    type: String,
    required: true,
    trim: true
  },
  numeroReferencia: {
    type: String,
    required: true,
    trim: true
  },
  cbuAlias: {
    type: String,
    required: true,
    trim: true
  }
});

// 🔥 Método útil
transferenciaSchema.methods.obtenerIdentificador = function () {
  return this.numeroReferencia;
};

const Transferencia = MetodoPago.discriminator("TRANSFERENCIA", transferenciaSchema);

module.exports = Transferencia;