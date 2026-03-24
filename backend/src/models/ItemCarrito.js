const mongoose = require("mongoose");

const ItemCarritoSchema = new mongoose.Schema({
  idItemCarrito: Number,
  curso: String, // después se puede relacionar
  precioUnitario: Number
});

module.exports = mongoose.model("ItemCarrito", ItemCarritoSchema);