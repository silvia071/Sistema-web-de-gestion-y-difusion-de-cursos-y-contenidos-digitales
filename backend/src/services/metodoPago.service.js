const MetodoPago = require("../models/metodoPago.model");
require("../models/tarjeta.model");
require("../models/transferencia.model");

const crearMetodoPago = async (data) => {
  const existe = await MetodoPago.findOne({ tipo: data.tipo });

  if (existe) {
    throw new Error("El método de pago ya existe");
  }

  const metodo = new MetodoPago(data);
  return await metodo.save();
};

const listarMetodosPago = async () => {
  return await MetodoPago.find().sort({ tipo: 1 });
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
