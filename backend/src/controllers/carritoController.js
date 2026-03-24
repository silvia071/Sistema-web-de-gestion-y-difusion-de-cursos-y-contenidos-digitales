const Carrito = require("../models/Carrito");
const ItemCarrito = require("../models/ItemCarrito");


const crearCarrito = async (req, res) => {
  try {
    const carrito = new Carrito({
      idCarrito: Date.now(),
      items: [],
      estado: "ABIERTO",
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    });

    await carrito.save();

    res.status(201).json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerCarrito = async (req, res) => {
  try {
    const carrito = await Carrito.findById(req.params.id).populate("items");
    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const agregarItem = async (req, res) => {
  try {
    const { carritoId, curso, precioUnitario } = req.body;

    const item = new ItemCarrito({
      idItemCarrito: Date.now(),
      curso,
      precioUnitario
    });

    await item.save();

    const carrito = await Carrito.findById(carritoId);

    carrito.items.push(item._id);
    carrito.fechaActualizacion = new Date();

    await carrito.save();

    res.json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const calcularTotal = async (req, res) => {
  try {
    const carrito = await Carrito.findById(req.params.id).populate("items");

    let total = 0;

    carrito.items.forEach(item => {
      total += item.precioUnitario;
    });

    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearCarrito,
  obtenerCarrito,
  agregarItem,
  calcularTotal
};