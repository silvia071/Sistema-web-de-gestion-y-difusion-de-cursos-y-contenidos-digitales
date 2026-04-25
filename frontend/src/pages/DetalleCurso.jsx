import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { API_BASE } from "../config/api";
import "./DetalleCurso.css";

import jsImg from "../assets/javaScript.png";
import pyImg from "../assets/Python.png";
import javaImg from "../assets/java.png";
import htmlImg from "../assets/html.png";
import cppImg from "../assets/C++.png";
import reactImg from "../assets/react.png";

const imagenes = {
  JavaScript: jsImg,
  Python: pyImg,
  Java: javaImg,
  "HTML y CSS": htmlImg,
  "C++": cppImg,
  React: reactImg,
};

function DetalleCurso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [yaComprado, setYaComprado] = useState(false);

  // 🔹 Cargar curso
  useEffect(() => {
    const cargarCurso = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cursos/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.message);

        setCurso(data);
      } catch (err) {
        setError("Error al cargar el curso");
      } finally {
        setLoading(false);
      }
    };

    cargarCurso();
  }, [id]);

  // 🔹 Verificar si ya lo compró
  useEffect(() => {
    const verificarCompra = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        const res = await fetch(
          `${API_BASE}/api/acceso-curso/usuario/${userId}`,
        );

        const data = await res.json();

        const tieneCurso = data.some((acceso) => acceso?.curso?._id === id);

        setYaComprado(tieneCurso);
      } catch (err) {
        console.error(err);
      }
    };

    verificarCompra();
  }, [id]);

  const precioFormateado = useMemo(() => {
    if (!curso?.precio) return "$0";
    return `$${curso.precio.toLocaleString("es-AR")}`;
  }, [curso]);

  const obtenerImagenCurso = (cursoActual) => {
    const categoria = cursoActual?.categoria?.nombre;

    if (categoria && imagenes[categoria]) return imagenes[categoria];

    const titulo = cursoActual?.titulo?.toLowerCase() || "";

    if (titulo.includes("javascript")) return jsImg;
    if (titulo.includes("python")) return pyImg;
    if (titulo.includes("java")) return javaImg;
    if (titulo.includes("html")) return htmlImg;
    if (titulo.includes("css")) return htmlImg;
    if (titulo.includes("c++")) return cppImg;
    if (titulo.includes("react")) return reactImg;

    return "/placeholder-curso.png";
  };

  const handleAgregarAlCarrito = () => {
    agregarAlCarrito({
      ...curso,
      imagen: obtenerImagenCurso(curso),
    });
  };

  const handleEntrarAlCurso = () => {
    navigate(`/curso/${curso._id}`);
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!curso) return <p>No encontrado</p>;

  return (
    <section className="detalle-curso-page">
      {/* 🔹 BOTÓN VOLVER */}
      <div className="detalle-curso-top">
        <button className="btn-volver-cta" onClick={() => navigate("/cursos")}>
          ← Volver a cursos
        </button>
      </div>

      {/* 🔹 CARD PRINCIPAL */}
      <div className="detalle-curso-card">
        {/* IMAGEN */}
        <div className="detalle-curso-imagen">
          <img src={obtenerImagenCurso(curso)} alt={curso.titulo} />
        </div>

        {/* INFO */}
        <div className="detalle-curso-info">
          <span className="detalle-curso-categoria">
            {curso.categoria?.nombre}
          </span>

          <h1>{curso.titulo}</h1>

          <p className="detalle-curso-descripcion">{curso.descripcion}</p>

          <div className="detalle-curso-meta">
            <span>Nivel: {curso.nivel}</span>
            <span>Duración: {curso.duracion}</span>
          </div>

          {!yaComprado && (
            <p className="detalle-curso-precio">{precioFormateado}</p>
          )}

          {yaComprado ? (
            <button className="detalle-curso-btn" onClick={handleEntrarAlCurso}>
              Entrar al curso
            </button>
          ) : (
            <button
              className="detalle-curso-btn"
              onClick={handleAgregarAlCarrito}
            >
              Agregar al carrito
            </button>
          )}
        </div>
      </div>

      {/* 🔹 BLOQUES */}
      <div className="detalle-curso-extra">
        {/* APRENDIZAJES */}
        <div className="detalle-curso-bloque">
          <h2>Qué vas a aprender</h2>

          {curso.aprendizajes?.length > 0 ? (
            <ul className="detalle-curso-lista">
              {curso.aprendizajes.map((item, i) => (
                <li key={i}>✔ {item}</li>
              ))}
            </ul>
          ) : (
            <p className="detalle-curso-vacio">
              Próximamente vas a tener los objetivos del curso.
            </p>
          )}
        </div>

        {/* LECCIONES */}
        <div className="detalle-curso-bloque">
          <h2>Lecciones incluidas</h2>

          <div className="lecciones-lista">
            {curso.lecciones?.map((l, i) => (
              <div
                key={l._id}
                className="leccion-item"
                onClick={() => navigate(`/curso/${curso._id}?leccion=${l._id}`)}
              >
                <div className="leccion-numero">{i + 1}</div>

                <div className="leccion-info">
                  <span className="leccion-titulo">{l.titulo}</span>
                  <span className="leccion-duracion">
                    {l.duracionMinutos} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default DetalleCurso;
