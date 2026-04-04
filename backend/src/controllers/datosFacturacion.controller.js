const service = require("../services/datosFacturacion.service");

const crearDatosFacturacion = async (req, res) => {
  try {
    const datos = await service.crearDatosFacturacion(req.body);
    res.status(201).json(datos);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const listarDatosFacturacion = async (req, res) => {
  const datos = await service.listarDatosFacturacion();
  res.json(datos);
};

const buscarDatosFacturacion = async (req, res) => {
  const dato = await service.buscarPorId(req.params.id);
  if (!dato) return res.status(404).json({ error: "No encontrado" });
  res.json(dato);
};

const actualizarDatosFacturacion = async (req, res) => {
  const dato = await service.actualizarDatos(req.params.id, req.body);
  res.json(dato);
};

const eliminarDatosFacturacion = async (req, res) => {
  await service.eliminarDatos(req.params.id);
  res.json({ mensaje: "Eliminado correctamente" });
};

module.exports = {
  crearDatosFacturacion,
  listarDatosFacturacion,
  buscarDatosFacturacion,
  actualizarDatosFacturacion,
  eliminarDatosFacturacion
};