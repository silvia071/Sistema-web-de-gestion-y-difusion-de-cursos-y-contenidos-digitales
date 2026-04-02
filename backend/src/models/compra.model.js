const mongoose = require("mongoose");
const EstadoCompra = require("../enums/estadoCompra");

const compraSchema = new mongoose.Schema({
  idUsuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: false 
  },
  detalles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DetalleCompra"
    }
  ],
  estado: {
    type: String,
    enum: Object.values(EstadoCompra).filter(v => typeof v === "string"),
    default: EstadoCompra.PENDIENTE
  },
  subtotal: Number,
  total: Number,
  fechaCompra: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Compra", compraSchema);