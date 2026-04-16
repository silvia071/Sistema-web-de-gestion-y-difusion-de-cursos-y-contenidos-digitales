const carritoService = require("../services/carrito.service");
const compraService = require("../services/compra.service");

const generarCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Falta id del carrito" });
    }

    if (!usuarioId) {
      return res.status(400).json({ error: "Falta usuarioId" });
    }

    const carrito = await carritoService.obtenerCarritoActivo(id);

    if (!carrito) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const compra = await compraService.generarCompraDesdeCarrito(
      carrito,
      usuarioId,
    );

    res.status(201).json(compra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const eliminarCompra = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Falta id de la compra" });
    }

    const compra = await compraService.eliminarCompra(id);
    res.json(compra);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  generarCompra,
  eliminarCompra,
};
