const Carrito = require("../models/carrito.model");
const ItemCarrito = require("../models/itemCarrito.model");
const EstadoCarrito = require("../enums/estadoCarrito");
const Curso = require("../models/curso.model");

const crearCarrito = async (usuarioId) => {
  if (!usuarioId) {
    throw new Error("El usuario es obligatorio");
  }

  const carritoExistente = await Carrito.findOne({
    usuario: usuarioId,
    estado: EstadoCarrito.ABIERTO,
  }).populate({
    path: "items",
    populate: {
      path: "curso",
    },
  });

  if (carritoExistente) {
    return carritoExistente;
  }

  return await Carrito.create({
    usuario: usuarioId,
    items: [],
    estado: EstadoCarrito.ABIERTO,
  });
};

const obtenerCarritoActivo = async (id) => {
  const carrito = await Carrito.findById(id).populate({
    path: "items",
    populate: {
      path: "curso",
    },
  });

  if (!carrito) throw new Error("Carrito no encontrado");
  if (carrito.estado !== EstadoCarrito.ABIERTO) {
    throw new Error("Carrito no activo");
  }

  return carrito;
};

const agregarCursoAlCarrito = async (idCarrito, idCurso) => {
  const curso = await Curso.findById(idCurso);
  if (!curso) throw new Error("Curso no existe");

  const carrito = await Carrito.findById(idCarrito).populate("items");
  if (!carrito) throw new Error("Carrito no encontrado");

  if (carrito.estado !== EstadoCarrito.ABIERTO) {
    throw new Error("Carrito no activo");
  }

  const itemExistente = await ItemCarrito.findOne({
    _id: { $in: carrito.items.map((item) => item._id) },
    curso: idCurso,
  });

  if (itemExistente) {
    throw new Error("El curso ya está en el carrito");
  }

  const item = await ItemCarrito.create({
    curso: idCurso,
    precioUnitario: curso.precio,
  });

  carrito.agregarItem(item._id);
  await carrito.save();

  return await Carrito.findById(idCarrito).populate({
    path: "items",
    populate: {
      path: "curso",
    },
  });
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

  return await Carrito.findById(idCarrito).populate({
    path: "items",
    populate: {
      path: "curso",
    },
  });
};

const vaciarCarrito = async (idCarrito) => {
  const carrito = await Carrito.findById(idCarrito);
  if (!carrito) throw new Error("Carrito no encontrado");

  if (carrito.estado !== EstadoCarrito.ABIERTO) {
    throw new Error("Carrito no activo");
  }

  const itemsIds = [...carrito.items];

  carrito.vaciar();
  await carrito.save();

  await ItemCarrito.deleteMany({
    _id: { $in: itemsIds },
  });

  return await Carrito.findById(idCarrito).populate({
    path: "items",
    populate: {
      path: "curso",
    },
  });
};

const calcularTotalCarrito = async (idCarrito) => {
  const carrito = await Carrito.findById(idCarrito).populate("items");
  if (!carrito) throw new Error("Carrito no encontrado");

  let total = 0;
  carrito.items.forEach((item) => {
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
  calcularTotalCarrito,
};
