const mongoose = require("mongoose");
const EstadoContenido = require("../enums/estadoContenido");

const publicacionSchema = new mongoose.Schema(
  {
    idPublicacion: {
      type: Number,
      required: true,
      unique: true,
    },
    titulo: {
      type: String,
      required: true,
    },
    contenido: {
      type: String,
      required: true,
    },
    fechaPublicacion: {
      type: Date,
      default: Date.now,
    },
    estado: {
      type: String,
      enum: Object.values(EstadoContenido),
      default: EstadoContenido.BORRADOR,
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categoria",
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

publicacionSchema.methods.actualizarTitulo = function (nuevoTitulo) {
  this.titulo = nuevoTitulo;
};

publicacionSchema.methods.actualizarContenido = function (nuevoContenido) {
  this.contenido = nuevoContenido;
};

publicacionSchema.methods.asignarCategoria = function (categoriaId) {
  this.categoria = categoriaId;
};

publicacionSchema.methods.cambiarEstado = function (nuevoEstado) {
  this.estado = nuevoEstado;
};

publicacionSchema.methods.estaPublicado = function () {
  return this.estado === EstadoContenido.PUBLICADO;
};

publicacionSchema.methods.mostrarPublicacion = function () {
  return {
    idPublicacion: this.idPublicacion,
    titulo: this.titulo,
    contenido: this.contenido,
    fechaPublicacion: this.fechaPublicacion,
    estado: this.estado,
    categoria: this.categoria,
  };
};

module.exports = mongoose.model("Publicacion", publicacionSchema);
