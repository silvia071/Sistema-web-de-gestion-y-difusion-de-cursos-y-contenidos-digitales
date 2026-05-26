const cuponService = require("../services/cupon.service");

const aplicarCupon = async (req, res) => {
  try {
    const { codigo, carritoId } = req.body;

    if (!codigo || !carritoId) {
      return res.status(400).json({
        mensaje: "El código del cupón y el carrito son obligatorios",
      });
    }

    const resultado = await cuponService.aplicarCuponACarrito(
      codigo,
      carritoId,
      req.usuario._id,
    );

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(400).json({
      mensaje: error.message || "Error al aplicar el cupón",
    });
  }
};

const quitarCupon = async (req, res) => {
  try {
    const { carritoId } = req.params;

    const resultado = await cuponService.quitarCuponDeCarrito(
      carritoId,
      req.usuario._id,
    );

    return res.status(200).json(resultado);
  } catch (error) {
    return res.status(400).json({
      mensaje: error.message || "Error al quitar el cupón",
    });
  }
};

const crearCupon = async (req, res) => {
  try {
    const cupon = await cuponService.crearCupon(req.body);

    return res.status(201).json({
      mensaje: "Cupón creado correctamente",
      cupon,
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: error.message || "Error al crear el cupón",
    });
  }
};

const listarCupones = async (req, res) => {
  try {
    const cupones = await cuponService.listarCupones();

    return res.status(200).json(cupones);
  } catch (error) {
    return res.status(500).json({
      mensaje: error.message || "Error al listar los cupones",
    });
  }
};

const activarCupon = async (req, res) => {
  try {
    const { id } = req.params;

    const cupon = await cuponService.cambiarEstadoCupon(id, true);

    return res.status(200).json({
      mensaje: "Cupón activado correctamente",
      cupon,
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: error.message || "Error al activar el cupón",
    });
  }
};

const desactivarCupon = async (req, res) => {
  try {
    const { id } = req.params;

    const cupon = await cuponService.cambiarEstadoCupon(id, false);

    return res.status(200).json({
      mensaje: "Cupón desactivado correctamente",
      cupon,
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: error.message || "Error al desactivar el cupón",
    });
  }
};

module.exports = {
  aplicarCupon,
  quitarCupon,
  crearCupon,
  listarCupones,
  activarCupon,
  desactivarCupon,
};
