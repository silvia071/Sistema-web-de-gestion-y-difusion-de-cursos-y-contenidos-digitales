const mongoose = require("mongoose");

const detalleCompraSchema = new mongoose.Schema(
  {
    curso: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Curso",
      required: true,
    },

    precioUnitario: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

detalleCompraSchema.methods.calcularSubtotal = function () {
  return this.precioUnitario;
};

module.exports = mongoose.model("DetalleCompra", detalleCompraSchema);
