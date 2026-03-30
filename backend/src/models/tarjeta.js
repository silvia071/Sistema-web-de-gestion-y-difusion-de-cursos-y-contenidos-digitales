const mongoose = require("mongoose");
const MetodoPago = require("./metodoPago");

const tarjetaSchema = new mongoose.Schema({
  numeroTarjeta: String,
  fechaVencimiento: Date,
  codigoSeguridad: Number,
  tipoTarjeta: String
});

const Tarjeta = MetodoPago.discriminator("TARJETA", tarjetaSchema);

module.exports = Tarjeta;