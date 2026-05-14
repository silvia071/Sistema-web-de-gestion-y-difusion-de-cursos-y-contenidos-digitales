import api from "./api";

export const crearPago = async (data) => {
  try {
    const response = await api.post("/api/pagos", data);

    return response.data;
  } catch (error) {
    console.error("Error creando pago:", error);

    throw new Error(
      error.response?.data?.detalle ||
        error.response?.data?.mensaje ||
        "Error al crear el pago",
    );
  }
};
