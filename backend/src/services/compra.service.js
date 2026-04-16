const Compra = require("../models/compra.model");
const DetalleCompra = require("../models/detalleCompra.model");
const EstadoCompra = require("../enums/estadoCompra");

const generarCompraDesdeCarrito = async (carrito, usuarioId) => {
  if (!carrito || !carrito.items || carrito.items.length === 0) {
    throw new Error("El carrito está vacío");
  }

  if (!usuarioId) {
    throw new Error("El usuario es obligatorio");
  }

  let subtotal = 0;
  const detallesIds = [];

  for (const item of carrito.items) {
    if (!item.curso) {
      throw new Error("Uno de los items del carrito no tiene curso");
    }

    if (item.precioUnitario == null) {
      throw new Error("Uno de los items del carrito no tiene precioUnitario");
    }

    const cantidad = item.cantidad || 1;
    const subtotalDetalle = item.precioUnitario;

    const detalle = await DetalleCompra.create({
      curso: item.curso,
      precioUnitario: item.precioUnitario,
      subtotal: subtotalDetalle,
    });

    subtotal += subtotalDetalle;
    detallesIds.push(detalle._id);
  }

  const compra = await Compra.create({
    usuario: usuarioId,
    detalles: detallesIds,
    subtotal,
    total: subtotal,
    estado: EstadoCompra.PENDIENTE,
  });

  if (typeof carrito.finalizar === "function") {
    carrito.finalizar();
  } else {
    carrito.items = [];
  }

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
