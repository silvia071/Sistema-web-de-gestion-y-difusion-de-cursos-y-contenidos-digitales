const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.model");

const verificarToken = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "No autorizado",
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await Usuario.findById(decoded.id).select("-contrasenia");

    if (!usuario) {
      return res.status(401).json({
        mensaje: "No autorizado",
      });
    }

    req.usuario = usuario;

    next();
  } catch (error) {
    return res.status(401).json({
      mensaje: "Token inválido o expirado",
    });
  }
};

module.exports = { verificarToken };
