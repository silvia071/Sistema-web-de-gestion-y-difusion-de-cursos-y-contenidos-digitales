const carritoService = require("../services/carrito.service");
const compraService = require("../services/compra.service");

const generarCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Falta id del carrito" });
    }

    const carrito = await carritoService.obtenerCarritoActivo(id);

    const compra = await compraService.generarCompraDesdeCarrito(
      carrito,
      usuarioId
    );

    res.status(201).json(compra);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  generarCompra
};