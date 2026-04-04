let pagos = [];

function crearPago(monto, metodoPago) {
    const id = pagos.length + 1;
    const pago = new Pago(id, monto, metodoPago);
    pagos.push(pago);
    renderPagos();
}

function eliminarPago(id) {
    pagos = pagos.filter(p => p.idPago !== id);
    renderPagos();
}

function aprobarPago(id) {
    const pago = pagos.find(p => p.idPago === id);
    if (pago) {
        pago.aprobarPago();
        renderPagos();
    }
}