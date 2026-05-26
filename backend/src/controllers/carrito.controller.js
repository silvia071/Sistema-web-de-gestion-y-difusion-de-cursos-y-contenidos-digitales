const carritoService = require("../services/carrito.service");

const obtenerUsuarioId = (req) => req.usuario?._id;

const crearCarrito = async (req, res) => {
  try {
    const usuarioId = obtenerUsuarioId(req);

    if (!usuarioId) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    const carrito = await carritoService.crearCarrito(usuarioId);

    return res.status(201).json(carrito);
  } catch (error) {
    if (error.message.includes("obligatorio")) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};

const obtenerCarrito = async (req, res) => {
  try {
    const usuarioId = obtenerUsuarioId(req);
    const idCarrito = req.params.id;

    if (!usuarioId) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    const carrito = await carritoService.obtenerCarritoActivo(
      idCarrito,
      usuarioId,
    );

    return res.json(carrito);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes("no activo")) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message.includes("permiso")) {
      return res.status(403).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};

const agregarItem = async (req, res) => {
  try {
    const usuarioId = obtenerUsuarioId(req);
    const idCarrito = req.params.id;
    const { idCurso } = req.body;

    if (!usuarioId) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    if (!idCurso) {
      return res.status(400).json({
        error: "idCurso es obligatorio",
      });
    }

    const carrito = await carritoService.agregarCursoAlCarrito(
      idCarrito,
      idCurso,
      usuarioId,
    );

    return res.json(carrito);
  } catch (error) {
    if (
      error.message.includes("no encontrado") ||
      error.message.includes("no existe")
    ) {
      return res.status(404).json({ error: error.message });
    }

    if (
      error.message.includes("no activo") ||
      error.message.includes("ya está en el carrito") ||
      error.message.includes("ya tenés acceso") ||
      error.message.includes("compra pendiente") ||
      error.message.includes("disponible") ||
      error.message.includes("obligatorio")
    ) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message.includes("permiso")) {
      return res.status(403).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};

const eliminarItem = async (req, res) => {
  try {
    const usuarioId = obtenerUsuarioId(req);
    const idCarrito = req.params.id;
    const itemId = req.params.itemId;

    if (!usuarioId) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    const carrito = await carritoService.eliminarItemDelCarrito(
      idCarrito,
      itemId,
      usuarioId,
    );

    return res.json(carrito);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes("no activo")) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message.includes("permiso")) {
      return res.status(403).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};

const vaciarCarrito = async (req, res) => {
  try {
    const usuarioId = obtenerUsuarioId(req);
    const idCarrito = req.params.id;

    if (!usuarioId) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    const carrito = await carritoService.vaciarCarrito(idCarrito, usuarioId);

    return res.json(carrito);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes("no activo")) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message.includes("permiso")) {
      return res.status(403).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
  }
};

const calcularTotal = async (req, res) => {
  try {
    const usuarioId = obtenerUsuarioId(req);
    const idCarrito = req.params.id;

    if (!usuarioId) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    const resumen = await carritoService.calcularTotalCarrito(
      idCarrito,
      usuarioId,
    );

    return res.json(resumen);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }

    if (error.message.includes("no activo")) {
      return res.status(400).json({ error: error.message });
    }

    if (error.message.includes("permiso")) {
      return res.status(403).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message });
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
