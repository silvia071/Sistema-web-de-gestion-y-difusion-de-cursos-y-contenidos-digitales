const DatosFacturacion = require("../models/datosFacturacion.model");

const crearDatosFacturacion = async (datos) => {
  const nuevo = new DatosFacturacion(datos);
  return await nuevo.save();
};

const listarDatosFacturacion = async () => {
  return await DatosFacturacion.find().populate("usuario");
};

const buscarPorId = async (id) => {
  return await DatosFacturacion.findById(id).populate("usuario");
};

const actualizarDatos = async (id, datos) => {
  return await DatosFacturacion.findByIdAndUpdate(id, datos, { new: true });
};

const eliminarDatos = async (id) => {
  return await DatosFacturacion.findByIdAndDelete(id);
};

module.exports = {
  crearDatosFacturacion,
  listarDatosFacturacion,
  buscarPorId,
  actualizarDatos,
  eliminarDatos
};