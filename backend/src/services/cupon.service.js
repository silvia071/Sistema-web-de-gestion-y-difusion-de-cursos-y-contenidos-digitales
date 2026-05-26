const Cupon = require("../models/cupon.model");
const Carrito = require("../models/carrito.model");
const EstadoCarrito = require("../enums/estadoCarrito");

const obtenerSubtotalCarrito = (carrito) => {
  if (!carrito.items || carrito.items.length === 0) {
    return 0;
  }

  return carrito.items.reduce((total, item) => {
    const precio = Number(item.precioUnitario || item.precio || 0);
    const cantidad = Number(item.cantidad || 1);

    return total + precio * cantidad;
  }, 0);
};

const buscarCuponPorCodigo = async (codigo) => {
  if (!codigo || !codigo.trim()) {
    throw new Error("Debés ingresar un código de cupón");
  }

  const codigoNormalizado = codigo.trim().toUpperCase();

  const cupon = await Cupon.findOne({ codigo: codigoNormalizado });

  if (!cupon) {
    throw new Error("El cupón ingresado no existe");
  }

  return cupon;
};

const validarCuponParaCarrito = async (codigo, carritoId, usuarioId) => {
  const carrito = await Carrito.findById(carritoId).populate({
    path: "items",
    populate: {
      path: "curso",
      select: "titulo precio",
    },
  });

  if (!carrito) {
    throw new Error("Carrito no encontrado");
  }

  if (carrito.usuario.toString() !== usuarioId.toString()) {
    throw new Error("No tenés permiso para usar este carrito");
  }

  if (carrito.estado !== EstadoCarrito.ABIERTO) {
    throw new Error("El carrito no está abierto");
  }

  if (!carrito.items || carrito.items.length === 0) {
    throw new Error("No podés aplicar un cupón a un carrito vacío");
  }

  const cupon = await buscarCuponPorCodigo(codigo);

  if (!cupon.estaVigente()) {
    throw new Error("El cupón no está vigente");
  }

  const subtotal = obtenerSubtotalCarrito(carrito);

  if (subtotal <= 0) {
    throw new Error("El subtotal del carrito no es válido");
  }

  if (subtotal < cupon.montoMinimoCompra) {
    throw new Error(
      `El cupón requiere una compra mínima de $${cupon.montoMinimoCompra}`,
    );
  }

  const descuento = cupon.calcularDescuento(subtotal);
  const totalFinal = Math.max(subtotal - descuento, 0);

  if (descuento <= 0) {
    throw new Error("El cupón no genera descuento para este carrito");
  }

  return {
    carrito,
    cupon,
    subtotal,
    descuento,
    totalFinal,
  };
};

const aplicarCuponACarrito = async (codigo, carritoId, usuarioId) => {
  const { carrito, cupon, subtotal, descuento, totalFinal } =
    await validarCuponParaCarrito(codigo, carritoId, usuarioId);

  carrito.aplicarCupon(cupon, descuento);

  await carrito.save();

  return {
    mensaje: "Cupón aplicado correctamente",
    codigo: cupon.codigo,
    subtotal,
    descuento,
    totalFinal,
    carrito,
  };
};

const quitarCuponDeCarrito = async (carritoId, usuarioId) => {
  const carrito = await Carrito.findById(carritoId).populate("items");

  if (!carrito) {
    throw new Error("Carrito no encontrado");
  }

  if (carrito.usuario.toString() !== usuarioId.toString()) {
    throw new Error("No tenés permiso para modificar este carrito");
  }

  if (carrito.estado !== EstadoCarrito.ABIERTO) {
    throw new Error("El carrito no está abierto");
  }

  carrito.quitarCupon();

  await carrito.save();

  const subtotal = obtenerSubtotalCarrito(carrito);

  return {
    mensaje: "Cupón quitado correctamente",
    subtotal,
    descuento: 0,
    totalFinal: subtotal,
    carrito,
  };
};

const crearCupon = async (data) => {
  const codigoNormalizado = String(data.codigo || "")
    .trim()
    .toUpperCase();

  if (!codigoNormalizado) {
    throw new Error("El código del cupón es obligatorio");
  }

  const existe = await Cupon.findOne({ codigo: codigoNormalizado });

  if (existe) {
    throw new Error("Ya existe un cupón con ese código");
  }

  const nuevoCupon = new Cupon({
    ...data,
    codigo: codigoNormalizado,
  });

  return await nuevoCupon.save();
};

const listarCupones = async () => {
  return await Cupon.find().sort({ createdAt: -1 });
};

const cambiarEstadoCupon = async (id, activo) => {
  const cupon = await Cupon.findById(id);

  if (!cupon) {
    throw new Error("Cupón no encontrado");
  }

  cupon.activo = activo;

  return await cupon.save();
};

module.exports = {
  obtenerSubtotalCarrito,
  buscarCuponPorCodigo,
  validarCuponParaCarrito,
  aplicarCuponACarrito,
  quitarCuponDeCarrito,
  crearCupon,
  listarCupones,
  cambiarEstadoCupon,
};
