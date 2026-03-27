const mongoose = require("mongoose");

const carritoSchema = new mongoose.Schema({
  idCarrito: Number,
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemCarrito"
    }
  ],
  estado: {
    type: String,
    enum: ["ABIERTO", "FINALIZADO", "CANCELADO"],
    default: "ABIERTO"
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
});

carritoSchema.methods.agregarItem = function (itemId) {
  this.items.push(itemId);
};

carritoSchema.methods.eliminarItem = function (itemId) {
  this.items = this.items.filter(id => id.toString() !== itemId.toString());
};

carritoSchema.methods.vaciar = function () {
  this.items = [];
};

carritoSchema.methods.estaVacio = function () {
  return this.items.length === 0;
};

module.exports = mongoose.model("Carrito", carritoSchema);