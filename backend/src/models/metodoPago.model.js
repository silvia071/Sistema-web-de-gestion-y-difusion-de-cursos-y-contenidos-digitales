const mongoose = require("mongoose");

const metodoPagoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del método de pago es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [60, "El nombre no puede superar los 60 caracteres"],
    },

    tipo: {
      type: String,
      required: [true, "El tipo de método de pago es obligatorio"],
      enum: ["TARJETA", "TRANSFERENCIA", "MERCADO_PAGO", "EFECTIVO", "OTRO"],
    },

    descripcion: {
      type: String,
      trim: true,
      maxlength: [200, "La descripción no puede superar los 200 caracteres"],
      default: "",
    },

    alias: {
      type: String,
      trim: true,
      maxlength: [50, "El alias no puede superar los 50 caracteres"],
      default: "",
    },

    cbu: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function (valor) {
          if (!valor) return true;
          return /^\d{22}$/.test(valor);
        },
        message: "El CBU debe contener exactamente 22 números",
      },
    },

    titular: {
      type: String,
      trim: true,
      maxlength: [80, "El titular no puede superar los 80 caracteres"],
      default: "",
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

module.exports = mongoose.model("MetodoPago", metodoPagoSchema);
