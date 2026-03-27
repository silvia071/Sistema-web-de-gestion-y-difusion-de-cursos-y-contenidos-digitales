const mongoose = require("mongoose");

const compraSchema = new mongoose.Schema({
  idCompra: Number,
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true
  },
  detalles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DetalleCompra"
    }
  ],
  estado: {
    type: String,
    enum: ["PENDIENTE", "PAGADA", "CANCELADA", "ANULADA"],
    default: "PENDIENTE"
  },
  subtotal: Number,
  total: Number,
  fechaCompra: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Compra", compraSchema);