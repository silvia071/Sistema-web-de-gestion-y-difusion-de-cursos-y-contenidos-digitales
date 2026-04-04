const EstadoCompra = {
  PENDIENTE: "PENDIENTE",
  PAGADA: "PAGADA",
  CANCELADA: "CANCELADA",
  ANULADA: "ANULADA",

  estaActiva(estado) {
    return estado === this.PENDIENTE;
  },

  estaFinalizada(estado) {
    return estado === this.PAGADA;
  },

  estaCancelada(estado) {
    return estado === this.CANCELADA || estado === this.ANULADA;
  }
};

module.exports = EstadoCompra;