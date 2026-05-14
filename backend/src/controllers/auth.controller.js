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
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      token,
    });
  } catch (error) {
    return res.status(401).json({
      mensaje: "Credenciales inválidas",
    });
  }
};

module.exports = { iniciarSesion };
