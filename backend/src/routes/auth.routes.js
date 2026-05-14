const express = require("express");
const router = express.Router();

const { iniciarSesion } = require("../controllers/auth.controller");
const { validarLogin } = require("../middlewares/usuario.validator");

router.post("/login", validarLogin, iniciarSesion);

module.exports = router;
