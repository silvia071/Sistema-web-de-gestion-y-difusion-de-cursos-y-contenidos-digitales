const Compra = require("../models/compra.model");
const DetalleCompra = require("../models/detalleCompra.model");

const generarCompraDesdeCarrito = async (carrito, usuarioId) => {
  if (!carrito || carrito.items.length === 0) {
    throw new Error("El carrito está vacío");
  }

  let subtotal = 0;
  const detallesIds = [];

  for (const item of carrito.items) {
    if (!item.precioUnitario) {
      throw new Error("Item sin precio");
    }

    const detalle = await DetalleCompra.create({
      curso: item.curso,
      precioUnitario: item.precioUnitario,
      subtotal: item.precioUnitario
    });

    subtotal += item.precioUnitario;
    detallesIds.push(detalle._id);
  }

  const compra = await Compra.create({
    usuario: usuarioId,
    detalles: detallesIds,
    subtotal,
    total: subtotal,
    estado: "PENDIENTE"
  });

  carrito.estado = "FINALIZADO";
  await carrito.save();

return await Compra.findById(compra._id).populate("detalles");
};

module.exports = {
  generarCompraDesdeCarrito
};