const mongoose = require("mongoose");
const EstadoCarrito = require("../enums/estadoCarrito");

const carritoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },

  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ItemCarrito",
    },
  ],

  cupon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cupon",
    default: null,
  },

  descuentoAplicado: {
    type: Number,
    default: 0,
    min: 0,
  },

  codigoCuponAplicado: {
    type: String,
    trim: true,
    uppercase: true,
    default: null,
  },

  estado: {
    type: String,
    enum: Object.values(EstadoCarrito).filter((v) => typeof v === "string"),
    default: EstadoCarrito.ABIERTO,
  },

  fechaCreacion: {
    type: Date,
    default: Date.now,
  },

  fechaActualizacion: {
    type: Date,
    default: Date.now,
  },
});

carritoSchema.methods.agregarItem = function (idItem) {
  if (!EstadoCarrito.esEditable(this.estado)) {
    throw new Error("El carrito no está abierto");
  }

  this.items.push(idItem);
  this.fechaActualizacion = Date.now();
};

carritoSchema.methods.eliminarItem = function (idItem) {
  if (!EstadoCarrito.esEditable(this.estado)) {
    throw new Error("El carrito no está abierto");
  }

  this.items = this.items.filter((id) => id.toString() !== idItem.toString());
  this.fechaActualizacion = Date.now();
};

carritoSchema.methods.vaciar = function () {
  if (!EstadoCarrito.esEditable(this.estado)) {
    throw new Error("El carrito no está abierto");
  }

  this.items = [];
  this.cupon = null;
  this.descuentoAplicado = 0;
  this.codigoCuponAplicado = null;
  this.fechaActualizacion = Date.now();
};

carritoSchema.methods.aplicarCupon = function (cupon, descuento) {
  if (!EstadoCarrito.esEditable(this.estado)) {
    throw new Error("El carrito no está abierto");
  }

  this.cupon = cupon._id;
  this.codigoCuponAplicado = cupon.codigo;
  this.descuentoAplicado = descuento;
  this.fechaActualizacion = Date.now();
};

carritoSchema.methods.quitarCupon = function () {
  if (!EstadoCarrito.esEditable(this.estado)) {
    throw new Error("El carrito no está abierto");
  }

  this.cupon = null;
  this.descuentoAplicado = 0;
  this.codigoCuponAplicado = null;
  this.fechaActualizacion = Date.now();
};

carritoSchema.methods.estaVacio = function () {
  return this.items.length === 0;
};

carritoSchema.methods.finalizar = function () {
  this.estado = EstadoCarrito.FINALIZADO;
  this.fechaActualizacion = Date.now();
};

carritoSchema.methods.cancelar = function () {
  this.estado = EstadoCarrito.CANCELADO;
  this.fechaActualizacion = Date.now();
};

module.exports = mongoose.model("Carrito", carritoSchema);
