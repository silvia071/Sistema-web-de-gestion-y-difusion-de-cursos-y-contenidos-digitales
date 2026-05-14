const carritoService = require("../services/carrito.service");
const compraService = require("../services/compra.service");

const generarCompra = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario?._id;

    if (!id) {
      return res.status(400).json({
        mensaje: "Falta id del carrito",
      });
    }

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
      });
    }

    const carrito = await carritoService.obtenerCarritoActivo(id, usuarioId);

    const compra = await compraService.generarCompraDesdeCarrito(
      carrito,
      usuarioId,
    );

    return res.status(201).json({
      mensaje: "Compra generada correctamente",
      datos: compra,
    });
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({
        mensaje: error.message,
      });
    }

    if (error.message.includes("permiso")) {
      return res.status(403).json({
        mensaje: error.message,
      });
    }

    if (
      error.message.includes("vacío") ||
      error.message.includes("obligatorio") ||
      error.message.includes("no activo") ||
      error.message.includes("Ya tenés acceso") ||
      error.message.includes("disponible")
    ) {
      return res.status(400).json({
        mensaje: error.message,
      });
    }

    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};

const eliminarCompra = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        mensaje: "Falta id de la compra",
      });
    }

    const compra = await compraService.eliminarCompra(id);

    return res.status(200).json({
      mensaje: "Compra eliminada correctamente",
      datos: compra,
    });
  } catch (error) {
    if (error.message.includes("no encontrada")) {
      return res.status(404).json({
        mensaje: error.message,
      });
    }

    return res.status(400).json({
      mensaje: error.message,
    });
  }
};

module.exports = {
  generarCompra,
  eliminarCompra,
};
