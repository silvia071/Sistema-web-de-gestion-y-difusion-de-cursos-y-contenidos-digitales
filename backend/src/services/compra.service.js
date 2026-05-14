const Compra = require("../models/compra.model");
const DetalleCompra = require("../models/detalleCompra.model");
const AccesoCurso = require("../models/accesoCurso.model");
const EstadoCompra = require("../enums/estadoCompra");

const generarCompraDesdeCarrito = async (carrito, usuarioId) => {
  if (!carrito || !carrito.items || carrito.items.length === 0) {
    throw new Error("El carrito está vacío");
  }

  if (!usuarioId) {
    throw new Error("El usuario es obligatorio");
  }
if (!carrito.usuario || carrito.usuario.toString() !== usuarioId.toString()) {
  throw new Error("No tenés permiso para generar una compra con este carrito");
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

    const cursoId = item.curso._id || item.curso;

    const accesoExistente = await AccesoCurso.findOne({
      usuario: usuarioId,
      curso: cursoId,
      estado: "ACTIVO",
    });

    if (accesoExistente) {
      throw new Error("Ya tenés acceso a uno de los cursos del carrito");
    }

    const subtotalDetalle = Number(item.precioUnitario);

   if (
     !carrito.usuario ||
     carrito.usuario.toString() !== usuarioId.toString()
   ) {
     throw new Error(
       "No tenés permiso para generar una compra con este carrito",
     );
   }
    const detalle = await DetalleCompra.create({
      curso: cursoId,
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
