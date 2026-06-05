const Mensaje = require("../models/mensajeContacto.model");
const EstadoMensaje = require("../enums/estadoMensaje");
const mailer = require("../utils/mailer");

const enviarMensaje = async (datos) => {
  const { nombre, email, asunto, contenido, usuario } = datos;

  if (!nombre || !nombre.trim()) {
    throw new Error("El nombre es obligatorio");
  }

  if (!email || !email.trim()) {
    throw new Error("El email es obligatorio");
  }

  if (!contenido || !contenido.trim()) {
    throw new Error("El mensaje es obligatorio");
  }

  const nuevo = await Mensaje.create({
    nombre: nombre.trim(),
    email: email.toLowerCase().trim(),
    asunto: asunto?.trim() || "Consulta desde formulario de contacto",
    contenido: contenido.trim(),
    usuario: usuario || null,
    estado: EstadoMensaje.NO_LEIDO,
  });

  try {
    await mailer.sendContactMessageToAdmin({
      nombre: nuevo.nombre,
      email: nuevo.email,
      asunto: nuevo.asunto,
      contenido: nuevo.contenido,
      mensajeId: nuevo._id,
    });
  } catch (error) {
    console.error("Error al enviar email de contacto al administrador:", error);
  }

  return nuevo;
};

const listarMensajes = async () => {
  return await Mensaje.find({ estado: { $ne: EstadoMensaje.ELIMINADO } })
    .sort({ createdAt: -1, fechaEnvio: -1 })
    .populate("usuario", "nombre apellido email rol")
    .populate("respondidoPor", "nombre apellido email rol");
};

const buscarMensajePorId = async (id) => {
  return await Mensaje.findById(id)
    .populate("usuario", "nombre apellido email rol")
    .populate("respondidoPor", "nombre apellido email rol");
};

const marcarComoLeido = async (id) => {
  const mensaje = await Mensaje.findByIdAndUpdate(
    id,
    { estado: EstadoMensaje.LEIDO },
    { new: true },
  );

  if (!mensaje) {
    throw new Error("Mensaje no encontrado");
  }

  return mensaje;
};

const marcarComoRespondido = async (id) => {
  const mensaje = await Mensaje.findByIdAndUpdate(
    id,
    { estado: EstadoMensaje.RESPONDIDO },
    { new: true },
  );

  if (!mensaje) {
    throw new Error("Mensaje no encontrado");
  }

  return mensaje;
};

const responderMensaje = async (id, respuesta, adminId) => {
  if (!respuesta || !respuesta.trim()) {
    throw new Error("La respuesta es obligatoria");
  }

  const mensaje = await Mensaje.findById(id);

  if (!mensaje) {
    throw new Error("Mensaje no encontrado");
  }

  mensaje.respuestaAdmin = respuesta.trim();
  mensaje.fechaRespuesta = new Date();
  mensaje.respondidoPor = adminId || null;
  mensaje.estado = EstadoMensaje.RESPONDIDO;

  await mensaje.save();

  try {
    await mailer.sendContactReplyToUser({
      to: mensaje.email,
      nombre: mensaje.nombre,
      asunto: mensaje.asunto,
      consulta: mensaje.contenido,
      respuesta: mensaje.respuestaAdmin,
    });
  } catch (error) {
    console.error("Error al enviar email de respuesta al usuario:", error);
  }

  return await Mensaje.findById(mensaje._id)
    .populate("usuario", "nombre apellido email rol")
    .populate("respondidoPor", "nombre apellido email rol");
};

const eliminarMensaje = async (id) => {
  const mensaje = await Mensaje.findByIdAndUpdate(
    id,
    { estado: EstadoMensaje.ELIMINADO },
    { new: true },
  );

  if (!mensaje) {
    throw new Error("Mensaje no encontrado");
  }

  return mensaje;
};

module.exports = {
  enviarMensaje,
  listarMensajes,
  buscarMensajePorId,
  marcarComoLeido,
  marcarComoRespondido,
  responderMensaje,
  eliminarMensaje,
};
