const Compra = require("../models/compra.model");
const DetalleCompra = require("../models/detalleCompra.model");
const EstadoCompra = require("../enums/estadoCompra");

const generarCompraDesdeCarrito = async (carrito, usuarioId) => {
  if (!carrito || carrito.items.length === 0) {
    throw new Error("El carrito está vacío");
  }

  if (!usuarioId) {
    throw new Error("El usuario es obligatorio");
  }

  await carrito.populate("items");

  let subtotal = 0;
  const detallesIds = [];

  for (const item of carrito.items) {
    const detalle = await DetalleCompra.create({
      curso: item.curso,
      precioUnitario: item.precioUnitario,
      subtotal: item.precioUnitario,
    });

    subtotal += item.precioUnitario;
    detallesIds.push(detalle._id);
  }

  const compra = await Compra.create({
    usuario: usuarioId,
    detalles: detallesIds,
    subtotal,
    total: subtotal,
    estado: EstadoCompra.PENDIENTE,
  });

  carrito.finalizar();
  await carrito.save();

  return await Compra.findById(compra._id)
    .populate("usuario")
    .populate("detalles");
};

const eliminarCompra = async (compraId) => {
  const compra = await Compra.findByIdAndDelete(compraId);
  if (!compra) {
    throw new Error("Compra no encontrada");
  }
  return compra;
};

module.exports = {
  generarCompraDesdeCarrito,
  eliminarCompra,
};
