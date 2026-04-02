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
    const idCarrito = req.params.id;

    const carrito = await carritoService.obtenerCarritoActivo(idCarrito);
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
    const idCarrito = req.params.id;
    const { idCurso, precioUnitario } = req.body;

    if (!idCurso || precioUnitario == null) {
      return res.status(400).json({
        error: "idCurso y precioUnitario son obligatorios",
      });
    }

    const carrito = await carritoService.agregarCursoAlCarrito(
      idCarrito,
      idCurso,
      precioUnitario
    );

    res.json(carrito);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const eliminarItem = async (req, res) => {
  try {
    const idCarrito = req.params.id;
    const itemId = req.params.itemId;

    const carrito = await carritoService.eliminarItemDelCarrito(
      idCarrito,
      itemId
    );

    res.json(carrito);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const actualizarItem = async (req, res) => {
  try {
    const idCarrito = req.params.id;
    const itemId = req.params.itemId;
    const { idCurso, precioUnitario } = req.body;

    if (!idCurso || precioUnitario == null) {
      return res.status(400).json({
        error: "idCurso y precioUnitario son obligatorios",
      });
    }

    const carrito = await carritoService.actualizarItemEnCarrito(
      idCarrito,
      itemId,
      idCurso,
      precioUnitario
    );

    res.json(carrito);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
};

const vaciarCarrito = async (req, res) => {
  try {
    const idCarrito = req.params.id;

    const carrito = await carritoService.vaciarCarrito(idCarrito);
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
    const idCarrito = req.params.id;

    const total = await carritoService.calcularTotalCarrito(idCarrito);
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
  eliminarItem,
  actualizarItem,
  vaciarCarrito,
  calcularTotal,
};