const service = require("../services/mensajeContacto.service");

const crearMensaje = async (req, res) => {
  try {
    const mensaje = await service.enviarMensaje(req.body);
    res.status(201).json(mensaje);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const listarMensajes = async (req, res) => {
  try {
    const mensajes = await service.listarMensajes();
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({
      mensaje: error.message || "No se pudieron listar los mensajes",
    });
  }
};

const buscarMensajePorId = async (req, res) => {
  try {
    const mensaje = await service.buscarMensajePorId(req.params.id);

    if (!mensaje) {
      return res.status(404).json({ error: "No encontrado" });
    }

    res.json(mensaje);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message || "No se pudo buscar el mensaje",
    });
  }
};

const marcarComoLeido = async (req, res) => {
  try {
    const mensaje = await service.marcarComoLeido(req.params.id);
    res.json(mensaje);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message || "No se pudo marcar como leído",
    });
  }
};

const marcarComoRespondido = async (req, res) => {
  try {
    const mensaje = await service.marcarComoRespondido(req.params.id);
    res.json(mensaje);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message || "No se pudo marcar como respondido",
    });
  }
};

const eliminarMensaje = async (req, res) => {
  try {
    const mensaje = await service.eliminarMensaje(req.params.id);
    res.json(mensaje);
  } catch (error) {
    res.status(400).json({
      mensaje: error.message || "No se pudo eliminar el mensaje",
    });
  }
};

module.exports = {
  crearMensaje,
  listarMensajes,
  buscarMensajePorId,
  marcarComoLeido,
  marcarComoRespondido,
  eliminarMensaje,
};
