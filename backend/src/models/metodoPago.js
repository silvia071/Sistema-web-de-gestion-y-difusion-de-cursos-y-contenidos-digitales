const mongoose = require("mongoose");

const options = {
  discriminatorKey: "tipo",
  collection: "metodosPago"
};

const metodoPagoSchema = new mongoose.Schema({
  titular: {
    type: String,
    required: true
  }
}, options);

const MetodoPago = mongoose.model("MetodoPago", metodoPagoSchema);

module.exports = MetodoPago;