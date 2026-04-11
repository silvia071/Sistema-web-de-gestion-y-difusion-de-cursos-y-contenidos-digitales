const express = require("express");
const router = express.Router();

const {
  crearPago,
  listarPagos,
  buscarPagoPorId,
  aprobarPago,
  rechazarPago,
  crearPreferencia, 
} = require("../controllers/pago.controller");


router.get("/", listarPagos);
router.get("/:id", buscarPagoPorId);
router.post("/", crearPago);
router.patch("/:id/aprobar", aprobarPago);
router.patch("/:id/rechazar", rechazarPago);

router.post("/crear-preferencia", crearPreferencia);

router.post("/webhook", (req, res) => {
  console.log("Webhook recibido:", req.body);

  res.sendStatus(200);
});

module.exports = router;
