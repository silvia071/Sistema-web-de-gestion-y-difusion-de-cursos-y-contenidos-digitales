const Compra = require("../models/Compra");
const Carrito = require("../models/Carrito");
const DetalleCompra = require("../models/DetalleCompra");


const crearCompra = async (req, res) => {
  try {
    const compra = new Compra(req.body);
    await compra.save();

    res.status(201).json(compra);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerCompra = async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id).populate("detalles");
    res.json(compra);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkout = async (req, res) => {
  try {
    const { carritoId, usuario } = req.body;

    const carrito = await Carrito.findById(carritoId).populate("items");

    let subtotal = 0;
    let detalles = [];

    for (let item of carrito.items) {
      const detalle = new DetalleCompra({
        idDetalleCompra: Date.now(),
        curso: item.curso,
        precioUnitario: item.precioUnitario,
        subtotal: item.precioUnitario
      });

      await detalle.save();

      detalles.push(detalle._id);
      subtotal += item.precioUnitario;
    }

    const compra = new Compra({
      idCompra: Date.now(),
      usuario,
      detalles,
      estado: "PENDIENTE",
      subtotal,
      total: subtotal
    });

    await compra.save();

    res.json(compra);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const confirmarCompra = async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id);

    compra.estado = "PAGADA";
    compra.fechaPago = new Date();

    await compra.save();

    res.json(compra);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  crearCompra,
  obtenerCompra,
  checkout,
  confirmarCompra
};