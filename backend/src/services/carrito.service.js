const Carrito = require("../models/carrito.model");
const ItemCarrito = require("../models/itemCarrito.model");
const EstadoCarrito = require("../enums/estadoCarrito");
const Curso = require("../models/curso.model");

const crearCarrito = async () => {
  return await Carrito.create({}); 
};

const obtenerCarritoActivo = async (id) => {
  const carrito = await Carrito.findById(id).populate("items");     

  if (!carrito) throw new Error("Carrito no encontrado");
  if (carrito.estado !== EstadoCarrito.ABIERTO) throw new Error("Carrito no activo");

  return carrito; 
};

const agregarCursoAlCarrito = async (idCarrito, idCurso, precio) => {
  const curso = await Curso.findById(idCurso);
  if (!curso) throw new Error("Curso no existe");
 
  const item = await ItemCarrito.create({
    curso: idCurso,
    precioUnitario: precio
  });
 
  const carrito = await Carrito.findById(idCarrito);
  if (!carrito) throw new Error("Carrito no encontrado");

  if (carrito.estado !== EstadoCarrito.ABIERTO) {
    throw new Error("Carrito no activo");
  }

  carrito.agregarItem(item._id);
  await carrito.save();

  return carrito;
};

const eliminarItemDelCarrito = async (idCarrito, idItem) => {
  const carrito = await Carrito.findById(idCarrito);
  if (!carrito) throw new Error("Carrito no encontrado");

   if (carrito.estado !== EstadoCarrito.ABIERTO) {
    throw new Error("Carrito no activo");
  }
  carrito.eliminarItem(idItem);
  await carrito.save();

  await ItemCarrito.findByIdAndDelete(idItem);

  return carrito;
};

const vaciarCarrito = async (idCarrito) => {
  const carrito = await Carrito.findById(idCarrito);
  if (!carrito) throw new Error("Carrito no encontrado");

    if (carrito.estado !== EstadoCarrito.ABIERTO) {
    throw new Error("Carrito no activo");
  }
  carrito.vaciar();
  await carrito.save();

  return carrito;
};

const calcularTotalCarrito = async (idCarrito) => {
  const carrito = await Carrito.findById(idCarrito).populate("items");
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