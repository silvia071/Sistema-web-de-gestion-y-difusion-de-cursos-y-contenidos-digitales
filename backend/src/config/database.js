<<<<<<< HEAD
const mongoose = require('mongoose');

const conectarDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/proyecto-cursos');
        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

module.exports = conectarDB;


=======
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/proyectofinal";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
>>>>>>> 81f13ad2a7414e05679431a328a9eea82748025d
