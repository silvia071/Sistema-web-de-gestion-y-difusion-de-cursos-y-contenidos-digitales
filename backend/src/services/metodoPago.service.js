const MetodoPago = require("../models/metodoPago.model");
const Pago = require("../models/pago.model");

const crearMetodoPago = async (data) => {
  const nombreNormalizado = String(data.nombre || "").trim();
  const tipoNormalizado = String(data.tipo || "")
    .trim()
    .toUpperCase();

  const existe = await MetodoPago.findOne({
    nombre: {
      $regex: `^${nombreNormalizado.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      $options: "i",
    },
    tipo: tipoNormalizado,
  });

  if (existe) {
    throw new Error("Ya existe un método de pago con ese nombre y tipo");
  }

  const metodo = new MetodoPago({
    ...data,
    nombre: nombreNormalizado,
    tipo: tipoNormalizado,
  });

  return await metodo.save();
};

const listarMetodosPago = async () => {
  return await MetodoPago.find({
    activo: true,
  }).sort({
    tipo: 1,
    nombre: 1,
  });
};

const listarTodosMetodosPago = async () => {
  return await MetodoPago.find().sort({
    tipo: 1,
    nombre: 1,
  });
};

const actualizarMetodoPago = async (id, data) => {
  const metodo = await MetodoPago.findById(id);

  if (!metodo) {
    throw new Error("Método de pago no encontrado");
  }

  const nombreNormalizado = String(data.nombre || "").trim();
  const tipoNormalizado = String(data.tipo || "")
    .trim()
    .toUpperCase();

  const duplicado = await MetodoPago.findOne({
    _id: { $ne: id },
    nombre: {
      $regex: `^${nombreNormalizado.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      $options: "i",
    },
    tipo: tipoNormalizado,
  });

  if (duplicado) {
    throw new Error("Ya existe otro método con ese nombre y tipo");
  }

  metodo.nombre = nombreNormalizado;
  metodo.tipo = tipoNormalizado;
  metodo.descripcion = String(data.descripcion || "").trim();
  metodo.alias = String(data.alias || "").trim();
  metodo.cbu = String(data.cbu || "").trim();
  metodo.titular = String(data.titular || "").trim();
  metodo.activo = data.activo !== false;

  return await metodo.save();
};

const cambiarEstadoMetodoPago = async (id, activo) => {
  const metodo = await MetodoPago.findById(id);

  if (!metodo) {
    throw new Error("Método de pago no encontrado");
  }

  metodo.activo = Boolean(activo);

  return await metodo.save();
};

const buscarMetodoPagoPorId = async (id) => {
  return await MetodoPago.findById(id);
};

const eliminarMetodoPago = async (id) => {
  const metodo = await MetodoPago.findById(id);

  if (!metodo) {
    throw new Error("Método de pago no encontrado");
  }

  const fueUtilizado = await Pago.exists({
    metodoPago: id,
  });

  if (fueUtilizado) {
    throw new Error(
      "Este método de pago ya fue utilizado y no puede eliminarse. Podés desactivarlo para que deje de aparecer en el checkout.",
    );
  }

  return await MetodoPago.findByIdAndDelete(id);
};

module.exports = {
  crearMetodoPago,
  listarMetodosPago,
  listarTodosMetodosPago,
  buscarMetodoPagoPorId,
  eliminarMetodoPago,
  actualizarMetodoPago,
  cambiarEstadoMetodoPago,
};
