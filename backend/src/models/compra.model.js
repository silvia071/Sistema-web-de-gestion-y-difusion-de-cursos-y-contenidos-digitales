const mongoose = require("mongoose");
const EstadoCompra = require("../enums/estadoCompra");

const compraSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    detalles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DetalleCompra",
      },
    ],
    estado: {
      type: String,
      enum: Object.values(EstadoCompra).filter((v) => typeof v === "string"),
      default: EstadoCompra.PENDIENTE,
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    pago: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pago",
      default: null,
    },
    datosFacturacion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DatosFacturacion",
      default: null,
    },
    fechaCompra: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model("Compra", compraSchema);
