const { body, validationResult } = require('express-validator');

const validarRegistro = [
    
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres')
        .trim(),

    
    body('apellido')
        .notEmpty().withMessage('El apellido es obligatorio')
        .trim(),

   
    body('email')
        .trim()                     // 1. Quita espacios (FUNDAMENTAL)
        .notEmpty().withMessage('El email es obligatorio')
        .isEmail().withMessage('Debe proporcionar un email válido')
        .normalizeEmail(),           // 2. Recién acá lo pasa a minúsculas

    body('contrasenia')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

   

    body('rol')
        .optional()
        .isIn(['CLIENTE', 'ADMINISTRADOR']).withMessage('El rol no es válido'),


    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ 
                ok: false,
                errores: errores.array().map(err => ({ campo: err.path, mensaje: err.msg })) 
            });
        }
        next();
    }
];

const validarLogin = [
    body('email').isEmail().withMessage('Email inválido').trim(),
    body('contrasenia').notEmpty().withMessage('La contraseña es requerida'),
    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ ok: false, errores: errores.array() });
        }
        next();
    }
];

module.exports = {
    validarRegistro,
    validarLogin
};
