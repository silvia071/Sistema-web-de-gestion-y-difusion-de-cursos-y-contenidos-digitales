const Compra = require("../models/compra.model");
const DetalleCompra = require("../models/detalleCompra.model");
const Carrito = require("../models/carrito.model");
const EstadoCompra = require("../enums/estadoCompra");

const generarCompraDesdeCarrito = async (carrito, idUsuario) => {

  if (!carrito || carrito.items.length === 0) {
    throw new Error("El carrito está vacío");
  }

  await carrito.populate("items");

  let subtotal = 0;
  const detallesIds = [];

  for (const item of carrito.items) {

    const detalle = await DetalleCompra.create({
      curso: item.curso,
      precioUnitario: item.precioUnitario,
      subtotal: item.precioUnitario
    });

    subtotal += item.precioUnitario;
    detallesIds.push(detalle._id);
  }

  const compra = await Compra.create({
    idUsuario: idUsuario || null,
    detalles: detallesIds,
    subtotal,
    total: subtotal,
    estado: EstadoCompra.PENDIENTE
  });

  // 🔥 cerrar carrito
  carrito.finalizar();
  await carrito.save();

  return await Compra.findById(compra._id).populate("detalles");
};

const eliminarCompra = async (compraId) => {
  const compra = await Compra.findByIdAndDelete(compraId);
  if (!compra) throw new Error("Compra no encontrada");
  return compra;
};

module.exports = {
  generarCompraDesdeCarrito,
  eliminarCompra
};