const mongoose = require("mongoose");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/proyectofinal";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(MONGO_URI);

    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;