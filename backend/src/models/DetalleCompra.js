const mongoose = require("mongoose");

const DetalleCompraSchema = new mongoose.Schema({
  idDetalleCompra: Number,
  curso: String,
  precioUnitario: Number,
  subtotal: Number
});

module.exports = mongoose.model("DetalleCompra", DetalleCompraSchema);