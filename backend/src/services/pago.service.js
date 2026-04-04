const Pago = require("../models/pago.model");
const EstadoPago = require("../enums/estadoPago");

const crearPago = async (data) => {
  const pago = new Pago(data);
  return await pago.save();
};

const buscarPagoPorId = async (id) => {
  return await Pago.findById(id).populate("metodoPago");
};

const aprobarPago = async (id) => {
  return await Pago.findByIdAndUpdate(
    id,
    { estado: EstadoPago.APROBADO },
    { new: true }
  );
};

const rechazarPago = async (id) => {
  return await Pago.findByIdAndUpdate(
    id,
    { estado: EstadoPago.RECHAZADO },
    { new: true }
  );
};

const listarPagos = async () => {
  return await Pago.find()
    .populate("usuario")
    .populate("metodoPago");
};

module.exports = {
  crearPago,
  buscarPagoPorId,
  listarPagos,
  aprobarPago,
  rechazarPago,
};