require("dotenv").config(); // cargar variables de entorno

const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3000;

// 🔌 conexión a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB conectado");

    // 🚀 levantar servidor SOLO cuando conecta la DB
    app.listen(PORT, () => {
      console.log(`🚀 Server corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error al conectar MongoDB:", error);
  });