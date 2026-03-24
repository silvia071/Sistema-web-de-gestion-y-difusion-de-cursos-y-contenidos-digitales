const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") }); 

const app = require("./app");
const connectDB = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // conecta primero a la DB
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

startServer();