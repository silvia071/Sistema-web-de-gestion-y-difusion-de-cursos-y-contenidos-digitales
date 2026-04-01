const mongoose = require("mongoose");

const pagoSchema = new mongoose.Schema({
  monto: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ["PENDIENTE", "APROBADO", "RECHAZADO"],
    default: "PENDIENTE"
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  metodoPago: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MetodoPago",
    required: true
  }
}, { timestamps: true });


// 🔥 MÉTODOS

pagoSchema.methods.aprobarPago = async function () {
  this.estado = "APROBADO";
  return await this.save();
};

pagoSchema.methods.rechazarPago = async function () {
  this.estado = "RECHAZADO";
  return await this.save();
};

pagoSchema.methods.marcarPendiente = async function () {
  this.estado = "PENDIENTE";
  return await this.save();
};

pagoSchema.methods.estaAprobado = function () {
  return this.estado === "APROBADO";
};


module.exports = mongoose.model("Pago", pagoSchema);