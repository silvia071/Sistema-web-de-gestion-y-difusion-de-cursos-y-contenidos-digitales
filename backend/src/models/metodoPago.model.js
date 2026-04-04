const mongoose = require("mongoose");

const metodoPagoSchema = new mongoose.Schema(
  {
    tipo: {
      type: String,
      required: true,
      enum: ["TARJETA", "TRANSFERENCIA"],
    },
  },
  {
    discriminatorKey: "tipo",
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("MetodoPago", metodoPagoSchema);