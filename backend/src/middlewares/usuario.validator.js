const { body, param, validationResult } = require("express-validator");

const validarRespuesta = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errores: errores
        .array()
        .map((err) => ({ campo: err.path, mensaje: err.msg })),
    });
  }
  next();
};

const validarId = [
  param("id")
    .isMongoId()
    .withMessage("El ID proporcionado no es un formato válido de MongoDB"),
  validarRespuesta,
];

const validarRegistro = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres")
    .trim(),
  body("apellido").notEmpty().withMessage("El apellido es obligatorio").trim(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("Debe proporcionar un email válido"),
  body("contrasenia")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("rol")
    .optional()
    .isIn(["CLIENTE", "ADMINISTRADOR"])
    .withMessage("El rol no es válido"),
  validarRespuesta,
];

const validarLogin = [
  body("email").isEmail().withMessage("Email inválido").trim(),
  body("contrasenia").notEmpty().withMessage("La contraseña es requerida"),
  validarRespuesta,
];

const validarCambioRol = [
  body("nuevoRol")
    .notEmpty()
    .withMessage("El nuevo rol es obligatorio")
    .isIn(["CLIENTE", "ADMINISTRADOR"])
    .withMessage("El rol debe ser CLIENTE o ADMINISTRADOR"),
  validarRespuesta,
];
const validarEditarPerfil = [
  body("nombre")
    .optional()
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres")
    .trim(),

  body("apellido")
    .optional()
    .notEmpty()
    .withMessage("El apellido no puede estar vacío")
    .trim(),

  body("direccion")
    .optional()
    .notEmpty()
    .withMessage("La dirección no puede estar vacía")
    .trim(),

  body("telefono")
    .optional()
    .notEmpty()
    .withMessage("El teléfono no puede estar vacío")
    .trim(),

  validarRespuesta,
];

module.exports = {
  validarRegistro,
  validarLogin,
  validarId,
  validarCambioRol,
  validarEditarPerfil,
};
