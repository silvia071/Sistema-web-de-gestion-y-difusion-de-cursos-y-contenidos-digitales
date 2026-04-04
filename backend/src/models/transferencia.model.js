const MetodoPago = require("./metodoPago.model");
const mongoose = require("mongoose");

const transferenciaSchema = new mongoose.Schema({
  bancoEmisor: String,
  numeroReferencia: String,
  cbuAlias: String,
});

module.exports = MetodoPago.discriminator("TRANSFERENCIA", transferenciaSchema);