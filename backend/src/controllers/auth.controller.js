const { sendPasswordResetEmail } = require("../utils/mailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const Usuario = require("../models/usuario.model");
const usuarioService = require("../services/usuario.service");

const iniciarSesion = async (req, res) => {
  try {
    const { email, contrasenia } = req.body;

    if (!email || !contrasenia) {
      return res.status(400).json({
        mensaje: "Email y contraseña son obligatorios",
      });
    }

    const { usuario, token } = await usuarioService.iniciarSesion(
      email,
      contrasenia,
    );

    return res.status(200).json({
      mensaje: "Login exitoso",
      usuario: {
        id: usuario._id,
        _id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        estadoCuenta: usuario.estadoCuenta,
      },
      token,
    });
  } catch (error) {
    return res.status(401).json({
      mensaje: "Credenciales inválidas",
      error: error.message,
    });
  }
};

const registrarUsuario = async (req, res) => {
  try {
    const usuario = await usuarioService.registrarUsuario(req.body, {
      permitirRol: false,
    });

    return res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      datos: {
        id: usuario._id,
        _id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        estadoCuenta: usuario.estadoCuenta,
      },
    });
  } catch (error) {
    return res.status(400).json({
      mensaje: "Error en el registro de usuario",
      error: error.message,
    });
  }
};

const solicitarRecuperacionContrasenia = async (req, res) => {
  try {
    const { email } = req.body;

    const mensajeGenerico =
      "Si el email está registrado, recibirás un enlace para restablecer tu contraseña.";

    if (!email) {
      return res.status(400).json({
        mensaje: "El email es obligatorio",
      });
    }

    const usuario = await Usuario.findOne({
      email: email.toLowerCase().trim(),
    });

    // Respuesta genérica para no revelar si el email existe o no
    if (!usuario) {
      return res.status(200).json({
        mensaje: mensajeGenerico,
      });
    }

    // Token real que va en el link del mail
    const token = crypto.randomBytes(32).toString("hex");

    // Hash del token que se guarda en la base de datos
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    usuario.tokenRecuperacionContrasenia = tokenHash;
    usuario.expiracionTokenRecuperacion = Date.now() + 1000 * 60 * 15;

    await usuario.save();

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    const enlaceRecuperacion = `${frontendUrl}/restablecer-contrasenia/${token}`;

    await sendPasswordResetEmail({
      to: usuario.email,
      resetLink: enlaceRecuperacion,
    });

    return res.status(200).json({
      mensaje: mensajeGenerico,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al solicitar la recuperación de contraseña",
      error: error.message,
    });
  }
};

const restablecerContrasenia = async (req, res) => {
  try {
    const { token } = req.params;
    const { nuevaContrasenia } = req.body;

    if (!token) {
      return res.status(400).json({
        mensaje: "El token de recuperación es obligatorio",
      });
    }

    if (!nuevaContrasenia) {
      return res.status(400).json({
        mensaje: "La nueva contraseña es obligatoria",
      });
    }

    if (nuevaContrasenia.length < 6) {
      return res.status(400).json({
        mensaje: "La contraseña debe tener al menos 6 caracteres",
      });
    }

const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

const usuario = await Usuario.findOne({
  tokenRecuperacionContrasenia: tokenHash,
  expiracionTokenRecuperacion: { $gt: Date.now() },
});
    if (!usuario) {
      return res.status(400).json({
        mensaje: "El enlace de recuperación es inválido o expiró",
      });
    }

    const hashContrasenia = await bcrypt.hash(nuevaContrasenia, 10);

    usuario.contrasenia = hashContrasenia;
    usuario.tokenRecuperacionContrasenia = undefined;
    usuario.expiracionTokenRecuperacion = undefined;
    await usuario.save();

    return res.status(200).json({
      mensaje: "Contraseña restablecida correctamente",
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al restablecer la contraseña",
      error: error.message,
    });
  }
};

module.exports = {
  iniciarSesion,
  registrarUsuario,
  solicitarRecuperacionContrasenia,
  restablecerContrasenia,
};
