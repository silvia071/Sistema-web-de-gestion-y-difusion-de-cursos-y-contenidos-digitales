const mongoose = require("mongoose");

const pagoSchema = new mongoose.Schema({
  monto: {
    type: Number,
    required: true
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
});


// 🔥 MÉTODOS (equivalente a tu clase)

pagoSchema.methods.aprobarPago = function () {
  this.estado = "APROBADO";
};

pagoSchema.methods.rechazarPago = function () {
  this.estado = "RECHAZADO";
};

pagoSchema.methods.marcarPendiente = function () {
  this.estado = "PENDIENTE";
};

pagoSchema.methods.estaAprobado = function () {
  return this.estado === "APROBADO";
};


module.exports = mongoose.model("Pago", pagoSchema);
