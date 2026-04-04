const MetodoPago = require("./metodoPago.model");
const mongoose = require("mongoose");

const tarjetaSchema = new mongoose.Schema({
  numero: String,
  titular: String,
  fechaVencimiento: String,
  cvv: String,
});

module.exports = MetodoPago.discriminator("TARJETA", tarjetaSchema);