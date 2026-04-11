const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.model");

const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "Token de autenticación requerido",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Usuario no encontrado",
      });
    }

    req.user = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o expirado",
      detalle: error.message,
    });
  }
};

module.exports = { verificarToken };