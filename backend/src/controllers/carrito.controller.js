const carritoService = require("../services/carrito.service");

const crearCarrito = async (req, res) => {
  try {
    const { usuarioId } = req.body;

    if (!usuarioId) {
      return res.status(400).json({
        error: "usuarioId es obligatorio",
      });
    }

    const carrito = await carritoService.crearCarrito(usuarioId);
    res.status(201).json(carrito);
  } catch (error) {
    if (error.message.includes("obligatorio")) {
      return res.status(400).json({ error: error.message });
    }

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

    if (error.message.includes("no activo")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
};

const agregarItem = async (req, res) => {
  try {
    const idCarrito = req.params.id;
    const { idCurso } = req.body;

    if (!idCurso) {
      return res.status(400).json({
        error: "idCurso es obligatorio",
      });
    }

    const carrito = await carritoService.agregarCursoAlCarrito(
      idCarrito,
      idCurso,
    );

    res.json(carrito);
  } catch (error) {
    if (
      error.message.includes("no encontrado") ||
      error.message.includes("no existe")
    ) {
      return res.status(404).json({ error: error.message });
    }

    if (
      error.message.includes("no activo") ||
      error.message.includes("ya está en el carrito")
    ) {
      return res.status(400).json({ error: error.message });
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
      itemId,
    );

    res.json(carrito);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes("no activo")) {
      return res.status(400).json({ error: error.message });
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

    if (error.message.includes("no activo")) {
      return res.status(400).json({ error: error.message });
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
  vaciarCarrito,
  calcularTotal,
};
