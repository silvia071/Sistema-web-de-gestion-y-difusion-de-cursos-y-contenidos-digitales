const express = require("express");
const router = express.Router();

const cuponController = require("../controllers/cupon.controller");

const { verificarToken } = require("../middlewares/verificarToken.middleware");
const { verificarAdmin } = require("../middlewares/verificarAdmin.validator");

// Usuario logueado: aplicar o quitar cupón del carrito
router.post("/aplicar", verificarToken, cuponController.aplicarCupon);

router.delete(
  "/carrito/:carritoId",
  verificarToken,
  cuponController.quitarCupon,
);

// Admin: gestión de cupones
router.post("/", verificarToken, verificarAdmin, cuponController.crearCupon);

router.get("/", verificarToken, verificarAdmin, cuponController.listarCupones);

router.patch(
  "/:id/activar",
  verificarToken,
  verificarAdmin,
  cuponController.activarCupon,
);

router.patch(
  "/:id/desactivar",
  verificarToken,
  verificarAdmin,
  cuponController.desactivarCupon,
);

module.exports = router;
