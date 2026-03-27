const carritoService = require("../services/carrito.service");

const crearCarrito = async (req, res) => {
  try {
    const carrito = await carritoService.crearCarrito();
    res.status(201).json(carrito);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerCarrito = async (req, res) => {
  try {
    const carrito = await carritoService.obtenerCarritoActivo(req.params.id);
    res.json(carrito);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const agregarItem = async (req, res) => {
  try {
    const carritoId = req.params.id;
    const { curso, precioUnitario } = req.body;

    if (!curso || precioUnitario == null) {
      return res.status(400).json({ error: "curso y precioUnitario son obligatorios" });
    }

    const carrito = await carritoService.agregarCursoAlCarrito(carritoId, curso, precioUnitario);
    res.json(carrito);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const calcularTotal = async (req, res) => {
  try {
    const total = await carritoService.calcularTotalCarrito(req.params.id);
    res.json({ total });
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  crearCarrito,
  obtenerCarrito,
  agregarItem,
  calcularTotal
};