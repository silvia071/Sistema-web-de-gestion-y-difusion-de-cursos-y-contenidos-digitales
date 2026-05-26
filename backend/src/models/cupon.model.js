const mongoose = require("mongoose");

const tiposDescuento = ["PORCENTAJE", "MONTO_FIJO"];

const cuponSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    descripcion: {
      type: String,
      trim: true,
      default: "",
    },

    tipoDescuento: {
      type: String,
      enum: tiposDescuento,
      required: true,
    },

    valor: {
      type: Number,
      required: true,
      min: 0,
    },

    activo: {
      type: Boolean,
      default: true,
    },

    fechaInicio: {
      type: Date,
      default: Date.now,
    },

    fechaFin: {
      type: Date,
      default: null,
    },

    usoMaximo: {
      type: Number,
      default: null,
      min: 1,
    },

    usosActuales: {
      type: Number,
      default: 0,
      min: 0,
    },

    montoMinimoCompra: {
      type: Number,
      default: 0,
      min: 0,
    },

    cursosAplicables: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Curso",
      },
    ],
  },
  {
    timestamps: true,
  },
);

cuponSchema.methods.estaVigente = function () {
  const ahora = new Date();

  if (!this.activo) return false;

  if (this.fechaInicio && ahora < this.fechaInicio) return false;

  if (this.fechaFin && ahora > this.fechaFin) return false;

  if (this.usoMaximo !== null && this.usosActuales >= this.usoMaximo) {
    return false;
  }

  return true;
};

cuponSchema.methods.calcularDescuento = function (subtotal) {
  if (subtotal <= 0) return 0;

  if (subtotal < this.montoMinimoCompra) return 0;

  let descuento = 0;

  if (this.tipoDescuento === "PORCENTAJE") {
    descuento = subtotal * (this.valor / 100);
  }

  if (this.tipoDescuento === "MONTO_FIJO") {
    descuento = this.valor;
  }

  return Math.min(descuento, subtotal);
};

module.exports = mongoose.model("Cupon", cuponSchema);
