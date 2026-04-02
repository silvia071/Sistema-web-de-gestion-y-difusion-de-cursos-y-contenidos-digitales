const mongoose = require("mongoose");

const itemCarritoSchema = new mongoose.Schema({
  curso: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Curso",
    required: true
  },
  precioUnitario: {
    type: Number,
    required: true
  }
});

itemCarritoSchema.methods.calcularSubtotal = function () {
  return this.precioUnitario;
};

itemCarritoSchema.methods.mostrarItem = function () {
  return {
    curso: this.curso,
    precioUnitario: this.precioUnitario
  };
};

module.exports = mongoose.model("ItemCarrito", itemCarritoSchema);