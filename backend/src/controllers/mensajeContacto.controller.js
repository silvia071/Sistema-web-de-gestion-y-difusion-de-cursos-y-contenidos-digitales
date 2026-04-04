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
  const mensajes = await service.listarMensajes();
  res.json(mensajes);
};

const buscarMensajePorId = async (req, res) => {
  const mensaje = await service.buscarMensajePorId(req.params.id);
  if (!mensaje) return res.status(404).json({ error: "No encontrado" });
  res.json(mensaje);
};

const marcarComoLeido = async (req, res) => {
  const mensaje = await service.marcarComoLeido(req.params.id);
  res.json(mensaje);
};

const marcarComoRespondido = async (req, res) => {
  const mensaje = await service.marcarComoRespondido(req.params.id);
  res.json(mensaje);
};

const eliminarMensaje = async (req, res) => {
  const mensaje = await service.eliminarMensaje(req.params.id);
  res.json(mensaje);
};

module.exports = {
  crearMensaje,
  listarMensajes,
  buscarMensajePorId,
  marcarComoLeido,
  marcarComoRespondido,
  eliminarMensaje
};