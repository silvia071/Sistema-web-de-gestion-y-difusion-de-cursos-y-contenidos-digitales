import { useState } from "react";
import { crearPago } from "../services/pagoService";

const Curso = () => {
  const [loading, setLoading] = useState(false);

  const comprarCurso = async () => {
    try {
      setLoading(true);

      const data = await crearPago({
        titulo: "Curso React",
        precio: 5000,
      });

      if (!data.init_point) {
        throw new Error("No se recibió link de pago");
      }

      window.location.href = data.init_point;

    } catch (error) {
      console.error(error);
      alert("Error al iniciar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={comprarCurso} disabled={loading}>
      {loading ? "Procesando..." : "Comprar curso"}
    </button>
  );
};

export default Curso;