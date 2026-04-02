const carritoService = require("../services/carrito.service");
const compraService = require("../services/compra.service");

const generarCompra = async (req, res) => {
  try {
    const idCarrito = req.params.id;
    const { idUsuario } = req.body; // 👈 CORREGIDO

    if (!idCarrito) {
      return res.status(400).json({ error: "Falta id del carrito" });
    }

    const carrito = await carritoService.obtenerCarritoActivo(idCarrito);

    const compra = await compraService.generarCompraDesdeCarrito(
      carrito,
      idUsuario || null
    );

    res.status(201).json(compra);

  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
};

const eliminarCompra = async (req, res) => {
  try {
    const idCompra = req.params.id;

    const compra = await compraService.eliminarCompra(idCompra);
    res.json(compra);

  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  generarCompra,
  eliminarCompra,
};