const mongoose = require("mongoose");

const detalleCompraSchema = new mongoose.Schema({
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Curso",
    required: true,
  },
  precioUnitario: Number,
  subtotal: Number,
});

detalleCompraSchema.methods.calcularSubtotal = function () {
  return this.precioUnitario;
};

module.exports = mongoose.model("DetalleCompra", detalleCompraSchema);