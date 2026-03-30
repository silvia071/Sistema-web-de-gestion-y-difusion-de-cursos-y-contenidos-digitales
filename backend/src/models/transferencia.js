const mongoose = require("mongoose");
const MetodoPago = require("./metodoPago");

const transferenciaSchema = new mongoose.Schema({
  bancoEmisor: String,
  numeroReferencia: String,
  cbuAlias: String
});

const Transferencia = MetodoPago.discriminator("TRANSFERENCIA", transferenciaSchema);

module.exports = Transferencia;
