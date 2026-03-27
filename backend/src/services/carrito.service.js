const Carrito = require("../models/carrito.model");
const ItemCarrito = require("../models/itemCarrito.model");

const crearCarrito = async () => {
  return await Carrito.create({});
};

const obtenerCarritoActivo = async (id) => {
  const carrito = await Carrito.findById(id).populate("items");

  if (!carrito) throw new Error("Carrito no encontrado");
  if (carrito.estado !== "ABIERTO") throw new Error("Carrito no activo");

  return carrito;
};

const agregarCursoAlCarrito = async (carritoId, cursoId, precio) => {
  const item = await ItemCarrito.create({
    curso: cursoId,
    precioUnitario: precio
  });

  const carrito = await Carrito.findById(carritoId);
  if (!carrito) throw new Error("Carrito no encontrado");

  carrito.agregarItem(item._id);
  await carrito.save();

  return carrito;
};

const eliminarItemDelCarrito = async (carritoId, itemId) => {
  const carrito = await Carrito.findById(carritoId);
  if (!carrito) throw new Error("Carrito no encontrado");

  carrito.eliminarItem(itemId);
  await carrito.save();

  await ItemCarrito.findByIdAndDelete(itemId);

  return carrito;
};

const vaciarCarrito = async (carritoId) => {
  const carrito = await Carrito.findById(carritoId);
  if (!carrito) throw new Error("Carrito no encontrado");

  carrito.vaciar();
  await carrito.save();

  return carrito;
};

const calcularTotalCarrito = async (carritoId) => {
  const carrito = await Carrito.findById(carritoId).populate("items");
  if (!carrito) throw new Error("Carrito no encontrado");

  let total = 0;
  carrito.items.forEach(item => {
    total += item.precioUnitario;
  });

  return total;
};

module.exports = {
  crearCarrito,
  obtenerCarritoActivo,
  agregarCursoAlCarrito,
  eliminarItemDelCarrito,
  vaciarCarrito,
  calcularTotalCarrito
};