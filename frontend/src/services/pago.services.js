export const crearPago = async (curso) => {
  try {
    const res = await fetch("http://localhost:3000/api/pagos/crear-preferencia", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(curso),
    });

    if (!res.ok) {
      throw new Error("Error al crear el pago");
    }

    return await res.json();

  } catch (error) {
    console.error("Error en pago:", error);
    throw error;
  }
};