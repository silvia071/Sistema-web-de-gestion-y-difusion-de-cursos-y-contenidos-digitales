const Pago = require("../models/pago.model");
const Compra = require("../models/compra.model");
const AccesoCurso = require("../models/accesoCurso.model");
const EstadoPago = require("../enums/estadoPago");
const EstadoCompra = require("../enums/estadoCompra");

const crearPago = async (data) => {
  const { monto, metodoPago, usuario, compra } = data;

  if (!monto || !metodoPago || !usuario || !compra) {
    throw new Error("monto, metodoPago, usuario y compra son obligatorios");
  }

  const compraExistente = await Compra.findById(compra);
  if (!compraExistente) {
    throw new Error("La compra no existe");
  }

  if (compraExistente.pago) {
    throw new Error("La compra ya tiene un pago asociado");
  }

  if (monto !== compraExistente.total) {
    throw new Error("El monto del pago no coincide con el total de la compra");
  }

  const pago = new Pago(data);
  const pagoGuardado = await pago.save();

  compraExistente.pago = pagoGuardado._id;
  await compraExistente.save();

  return await Pago.findById(pagoGuardado._id)
    .populate("metodoPago")
    .populate("usuario")
    .populate("compra");
};

const buscarPagoPorId = async (id) => {
  return await Pago.findById(id)
    .populate("metodoPago")
    .populate("usuario")
    .populate("compra");
};

const aprobarPago = async (id) => {
  const pago = await Pago.findById(id);
  if (!pago) {
    throw new Error("Pago no encontrado");
  }

  if (pago.estado === EstadoPago.APROBADO) {
    return await Pago.findById(id)
      .populate("metodoPago")
      .populate("usuario")
      .populate("compra");
  }

  const compra = await Compra.findById(pago.compra).populate("detalles");
  if (!compra) {
    throw new Error("Compra no encontrada");
  }

  if (!compra.detalles || compra.detalles.length === 0) {
    throw new Error("La compra no tiene detalles");
  }

  pago.estado = EstadoPago.APROBADO;
  await pago.save();

  compra.estado = EstadoCompra.PAGADA;
  await compra.save();

  for (const detalle of compra.detalles) {
    const yaExiste = await AccesoCurso.findOne({
      usuario: pago.usuario,
      curso: detalle.curso,
    });

    if (!yaExiste) {
      await AccesoCurso.create({
        usuario: pago.usuario,
        curso: detalle.curso,
        compra: compra._id,
      });
    }
  }

  return await Pago.findById(id)
    .populate("metodoPago")
    .populate("usuario")
    .populate("compra");
};

const rechazarPago = async (id) => {
  const pago = await Pago.findById(id);
  if (!pago) {
    throw new Error("Pago no encontrado");
  }

  if (pago.estado === EstadoPago.RECHAZADO) {
    return await Pago.findById(id)
      .populate("metodoPago")
      .populate("usuario")
      .populate("compra");
  }

  pago.estado = EstadoPago.RECHAZADO;
  await pago.save();

  const compra = await Compra.findById(pago.compra);
  if (compra) {
    compra.estado = EstadoCompra.CANCELADA;
    await compra.save();
  }

  return await Pago.findById(id)
    .populate("metodoPago")
    .populate("usuario")
    .populate("compra");
};

const listarPagos = async () => {
  return await Pago.find()
    .populate("usuario")
    .populate("metodoPago")
    .populate("compra");
};

module.exports = {
  crearPago,
  buscarPagoPorId,
  listarPagos,
  aprobarPago,
  rechazarPago,
};
