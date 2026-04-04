const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
      validate: {
        validator: function (valor) {
          return valor && valor.trim().length > 0;
        },
        message: "El nombre no puede estar vacío",
      },
    },

    descripcion: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
      validate: {
        validator: function (valor) {
          return valor && valor.trim().length > 0;
        },
        message: "La descripción no puede estar vacía",
      },
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
    id: this._id,
    nombre: this.nombre,
    descripcion: this.descripcion,
  };
};

module.exports = mongoose.model("Categoria", categoriaSchema);
