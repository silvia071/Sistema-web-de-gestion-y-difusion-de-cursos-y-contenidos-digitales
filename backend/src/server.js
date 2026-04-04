<<<<<<< HEAD
const app = require('./app');
const conectarDB = require('./config/database');
=======
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = require("./app");
const connectDB = require("./config/database");
>>>>>>> 81f13ad2a7414e05679431a328a9eea82748025d

conectarDB();

<<<<<<< HEAD
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});

=======
const startServer = async () => {
  try {
    await connectDB(); // conectar primero a la base de datos

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
  }
};

startServer();
>>>>>>> 81f13ad2a7414e05679431a328a9eea82748025d
