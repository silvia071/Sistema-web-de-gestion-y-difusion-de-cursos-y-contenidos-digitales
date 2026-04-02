const EstadoCarrito = {
  ABIERTO: "ABIERTO",
  FINALIZADO: "FINALIZADO",
  CANCELADO: "CANCELADO",

  esEditable(estado) {
    return estado === this.ABIERTO;
  },

  estaCerrado(estado) {
    return estado === this.FINALIZADO || estado === this.CANCELADO;
  }
};

module.exports = EstadoCarrito;