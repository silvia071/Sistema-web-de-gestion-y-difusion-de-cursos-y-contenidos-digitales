const mongoose = require("mongoose");

const CompraSchema = new mongoose.Schema({
  idCompra: Number,
  usuario: String,
  detalles: [{ type: mongoose.Schema.Types.ObjectId, ref: "DetalleCompra" }],
  estado: String,
  subtotal: Number,
  total: Number,
  fechaPago: Date
});

module.exports = mongoose.model("Compra", CompraSchema);