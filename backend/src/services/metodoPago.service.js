const MetodoPago = require("../models/metodoPago.model");
require("../models/tarjeta.model");
require("../models/transferencia.model");

const crearMetodoPago = async (data) => {
  const metodo = new MetodoPago(data);
  return await metodo.save();
};

const listarMetodosPago = async () => {
  return await MetodoPago.find();
};

const buscarMetodoPagoPorId = async (id) => {
  return await MetodoPago.findById(id);
};

const eliminarMetodoPago = async (id) => {
  return await MetodoPago.findByIdAndDelete(id);
};

module.exports = {
  crearMetodoPago,
  listarMetodosPago,
  buscarMetodoPagoPorId,
  eliminarMetodoPago,
};