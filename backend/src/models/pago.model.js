const mongoose = require("mongoose");
const EstadoPago = require("../enums/estadoPago");

const pagoSchema = new mongoose.Schema(
  {
    monto: {
      type: Number,
      required: true,
      min: 0,
    },
    estado: {
      type: String,
      enum: Object.values(EstadoPago),
      default: EstadoPago.PENDIENTE,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
    metodoPago: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MetodoPago",
      required: true,
    },
    usuario: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Usuario"
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Pago", pagoSchema);