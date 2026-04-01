const MetodoPago = require("../models/metodoPago");

router.post("/", async (req, res) => {
  try {
    const { monto, metodoPago } = req.body;

    // 🔎 validar que exista
    const metodo = await MetodoPago.findById(metodoPago);

    if (!metodo) {
      return res.status(404).json({ error: "Método de pago no existe" });
    }

    const pago = new Pago({
      monto,
      metodoPago
    });

    await pago.save();
    res.json(pago);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const pagos = await Pago.find().populate("metodoPago");
  res.json(pagos);
});