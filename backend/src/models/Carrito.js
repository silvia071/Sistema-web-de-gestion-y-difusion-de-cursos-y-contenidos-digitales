const mongoose = require("mongoose");

const CarritoSchema = new mongoose.Schema({
  idCarrito: Number,
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: "ItemCarrito" }],
  estado: String,
  fechaCreacion: Date,
  fechaActualizacion: Date
});

module.exports = mongoose.model("Carrito", CarritoSchema);