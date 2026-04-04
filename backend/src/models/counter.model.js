const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

// Método para obtener el siguiente número
counterSchema.statics.getNextSequence = async function (nombre) {
  const counter = await this.findOneAndUpdate(
    { nombre: nombre },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
};

module.exports = mongoose.model("Counter", counterSchema);