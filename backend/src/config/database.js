const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Falta la variable de entorno MONGO_URI. Revisa backend/.env");
  process.exit(1);
}

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    console.log("Conectando a MongoDB con:", MONGO_URI.startsWith("mongodb+srv://") ? "MongoDB Atlas" : MONGO_URI);
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;