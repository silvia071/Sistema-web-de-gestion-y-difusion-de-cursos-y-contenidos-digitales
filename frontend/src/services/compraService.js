export const crearCompra = async (data) => {
  const res = await fetch("http://localhost:3000/api/compra", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Error al crear la compra");
  }

  return await res.json();
};
