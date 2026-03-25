class Pago {
    constructor(idPago, monto, metodoPago) {
        this.idPago = idPago;
        this.monto = monto;
        this.fecha = new Date();
        this.estado = "PENDIENTE";
        this.metodoPago = metodoPago;
    }

    aprobarPago() {
        this.estado = "APROBADO";
    }

    rechazarPago() {
        this.estado = "RECHAZADO";
    }

    marcarPendiente() {
        this.estado = "PENDIENTE";
    }

    estaAprobado() {
        return this.estado === "APROBADO";
    }
}