const carritoService = require("../services/carrito.service");
const compraService = require("../services/compra.service");
const mailer = require("../utils/mailer");

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

const obtenerMisCompras = async (req, res) => {
  try {
    const usuarioId = req.usuario?._id;

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
      });
    }

    const compras = await compraService.obtenerComprasPorUsuario(usuarioId);

    return res.status(200).json({
      mensaje: "Compras del usuario obtenidas correctamente",
      datos: compras,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener las compras del usuario",
      error: error.message,
    });
  }
};

const obtenerMiCompraPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario?._id;

    if (!id) {
      return res.status(400).json({
        mensaje: "Falta id de la compra",
      });
    }

    if (!usuarioId) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
      });
    }

    const compra = await compraService.obtenerCompraPorIdYUsuario(
      id,
      usuarioId,
    );

    return res.status(200).json({
      mensaje: "Compra obtenida correctamente",
      datos: compra,
    });
  } catch (error) {
    if (error.message.includes("no encontrada")) {
      return res.status(404).json({
        mensaje: error.message,
      });
    }

    if (error.message.includes("permiso")) {
      return res.status(403).json({
        mensaje: error.message,
      });
    }

    return res.status(500).json({
      mensaje: "Error al obtener la compra",
      error: error.message,
    });
  }
};

const obtenerTodasLasCompras = async (req, res) => {
  try {
    const compras = await compraService.obtenerTodasLasCompras();

    return res.status(200).json({
      mensaje: "Compras obtenidas correctamente",
      datos: compras,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener las compras",
      error: error.message,
    });
  }
};

const obtenerCompraPorIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        mensaje: "Falta id de la compra",
      });
    }

    const compra = await compraService.obtenerCompraPorIdAdmin(id);

    return res.status(200).json({
      mensaje: "Compra obtenida correctamente",
      datos: compra,
    });
  } catch (error) {
    if (error.message.includes("no encontrada")) {
      return res.status(404).json({
        mensaje: error.message,
      });
    }

    return res.status(500).json({
      mensaje: "Error al obtener la compra",
      error: error.message,
    });
  }
};

const actualizarEstadoCompraAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!id) {
      return res.status(400).json({
        mensaje: "Falta id de la compra",
      });
    }

    if (!estado) {
      return res.status(400).json({
        mensaje: "El estado es obligatorio",
      });
    }

    const compra = await compraService.actualizarEstadoCompra(id, estado);

    return res.status(200).json({
      mensaje: "Estado de compra actualizado correctamente",
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

const notificarEstadoCompraAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        mensaje: "Falta id de la compra",
      });
    }

    const compra = await compraService.obtenerCompraPorIdAdmin(id);

    if (!compra.usuario?.email) {
      return res.status(400).json({
        mensaje: "La compra no tiene un email de usuario asociado",
      });
    }

    const numeroOrdenCorto = compra._id.toString().substring(0, 6);

    await mailer.sendOrderStatusEmail({
      to: compra.usuario.email,
      orden: compra,
      numeroOrden: numeroOrdenCorto,
    });

    return res.status(200).json({
      mensaje: "Notificación enviada correctamente",
    });
  } catch (error) {
    if (error.message.includes("no encontrada")) {
      return res.status(404).json({
        mensaje: error.message,
      });
    }

    return res.status(500).json({
      mensaje: "Error al notificar el estado de la compra",
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
  obtenerMisCompras,
  obtenerMiCompraPorId,
  obtenerTodasLasCompras,
  obtenerCompraPorIdAdmin,
  actualizarEstadoCompraAdmin,
  notificarEstadoCompraAdmin,
  eliminarCompra,
};
