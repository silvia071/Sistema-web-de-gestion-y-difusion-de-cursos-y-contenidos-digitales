const Mensaje = require("../models/mensajeContacto.model");
const EstadoMensaje = require("../enums/estadoMensaje");

const enviarMensaje = async (datos) => {
  const nuevo = new Mensaje(datos);
  return await nuevo.save();
};

const listarMensajes = async () => {
  return await Mensaje.find().populate("usuario");
};

const buscarMensajePorId = async (id) => {
  return await Mensaje.findById(id);
};

const marcarComoLeido = async (id) => {
  return await Mensaje.findByIdAndUpdate(
    id,
    { estado: EstadoMensaje.LEIDO },
    { new: true }
  );
};

const marcarComoRespondido = async (id) => {
  return await Mensaje.findByIdAndUpdate(
    id,
    { estado: EstadoMensaje.RESPONDIDO },
    { new: true }
  );
};

const eliminarMensaje = async (id) => {
  return await Mensaje.findByIdAndUpdate(
    id,
    { estado: EstadoMensaje.ELIMINADO },
    { new: true }
  );
};

module.exports = {
  enviarMensaje,
  listarMensajes,
  buscarMensajePorId,
  marcarComoLeido,
  marcarComoRespondido,
  eliminarMensaje
};