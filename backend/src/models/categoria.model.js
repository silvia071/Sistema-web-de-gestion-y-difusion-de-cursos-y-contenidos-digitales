const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema(
  {
    idCategoria: {
      type: Number,
      required: true,
      unique: true,
    },
    nombre: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    publicaciones: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Publicacion",
      },
    ],
  },
  {
    versionKey: false,
  },
);

categoriaSchema.methods.actualizarNombre = function (nuevoNombre) {
  this.nombre = nuevoNombre;
};

categoriaSchema.methods.actualizarDescripcion = function (nuevaDescripcion) {
  this.descripcion = nuevaDescripcion;
};

categoriaSchema.methods.mostrarCategoria = function () {
  return {
    idCategoria: this.idCategoria,
    nombre: this.nombre,
    descripcion: this.descripcion,
  };
};

module.exports = mongoose.model("Categoria", categoriaSchema);
