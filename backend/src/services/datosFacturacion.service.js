const DatosFacturacion = require("../models/datosFacturacion.model");

const crearDatosFacturacion = async (datos) => {
  const nuevo = new DatosFacturacion(datos);

  return await nuevo.save();
};

const listarDatosFacturacion = async () => {
  return await DatosFacturacion.find().populate(
    "usuario",
    "nombre apellido email rol",
  );
};

const buscarPorId = async (id) => {
  return await DatosFacturacion.findById(id).populate(
    "usuario",
    "nombre apellido email rol",
  );
};

const buscarPorUsuario = async (usuarioId) => {
  return await DatosFacturacion.findOne({ usuario: usuarioId }).populate(
    "usuario",
    "nombre apellido email rol",
  );
};

const actualizarDatos = async (id, datos) => {
  return await DatosFacturacion.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
  }).populate("usuario", "nombre apellido email rol");
};

const eliminarDatos = async (id) => {
  return await DatosFacturacion.findByIdAndDelete(id);
};

module.exports = {
  crearDatosFacturacion,
  listarDatosFacturacion,
  buscarPorId,
  buscarPorUsuario,
  actualizarDatos,
  eliminarDatos,
};
