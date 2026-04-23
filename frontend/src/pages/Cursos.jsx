import { useNavigate, useLocation } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useState, useEffect, useMemo } from "react";
import { API_BASE } from "../config/api";
import "../styles/App.css";

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

function Cursos() {
  const navigate = useNavigate();
  const location = useLocation();
  const { agregarAlCarrito, mensajeCarrito } = useCarrito();

  const params = new URLSearchParams(location.search);
  const categoriaSeleccionada = decodeURIComponent(
    params.get("categoria") || "",
  );

  const [categoriaActiva, setCategoriaActiva] = useState(
    categoriaSeleccionada || null,
  );
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setCategoriaActiva(categoriaSeleccionada || null);
  }, [categoriaSeleccionada]);

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API_BASE}/api/cursos`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error("No se pudieron cargar los cursos");
        }

        setCursos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los cursos");
      } finally {
        setLoading(false);
      }
    };

    cargarCursos();
  }, []);

  // 🔹 Categorías únicas
  const categorias = useMemo(() => {
    return [
      ...new Set(
        cursos.map((curso) => curso.categoria?.nombre).filter(Boolean),
      ),
    ];
  }, [cursos]);

  // 🔹 Cursos filtrados
  const cursosFiltrados = useMemo(() => {
    if (!categoriaActiva) return cursos;

    return cursos.filter(
      (curso) =>
        curso.categoria?.nombre?.toLowerCase() ===
        categoriaActiva.toLowerCase(),
    );
  }, [cursos, categoriaActiva]);

  // 🔥 Contador por categoría (optimizado)
  const cantidadPorCategoria = useMemo(() => {
    const conteo = {};

    cursos.forEach((curso) => {
      const nombre = curso.categoria?.nombre;
      if (nombre) {
        conteo[nombre] = (conteo[nombre] || 0) + 1;
      }
    });

    return conteo;
  }, [cursos]);

  // 🔹 Imagen automática
  const obtenerImagenCurso = (curso) => {
    const nombreCategoria = curso.categoria?.nombre;

    if (nombreCategoria && imagenes[nombreCategoria]) {
      return imagenes[nombreCategoria];
    }

    const titulo = curso.titulo?.toLowerCase() || "";

    if (titulo.includes("javascript")) return jsImg;
    if (titulo.includes("python")) return pyImg;
    if (titulo.includes("java")) return javaImg;
    if (titulo.includes("html")) return htmlImg;
    if (titulo.includes("css")) return htmlImg;
    if (titulo.includes("c++")) return cppImg;
    if (titulo.includes("react")) return reactImg;

    return jsImg;
  };

  const handleAgregarAlCarrito = (e, curso) => {
    e.stopPropagation();

    agregarAlCarrito({
      ...curso,
      imagen: obtenerImagenCurso(curso),
    });
  };

  const handleVerCurso = (e, cursoId) => {
    e.stopPropagation();
    navigate(`/cursos/${cursoId}`);
  };

  // 🔹 Estados de carga
  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <p>Cargando cursos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <div className="container">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      {mensajeCarrito && (
        <div className="toast-carrito">✅ {mensajeCarrito}</div>
      )}

      <div className="container">
        <div className="section-header">
          <h2>Cursos</h2>
          <p>
            Explorá los cursos disponibles para aprender programación paso a
            paso.
          </p>
        </div>

        {/* 🔥 FILTRO MEJORADO */}
        <div className="filtros">
          <span className="filtros-titulo">Categorías</span>

          <div className="filtros-botones">
            <button
              className={!categoriaActiva ? "activo" : ""}
              onClick={() => setCategoriaActiva(null)}
            >
              Todas
            </button>

            {categorias.map((cat) => (
              <button
                key={cat}
                className={categoriaActiva === cat ? "activo" : ""}
                onClick={() => setCategoriaActiva(cat)}
              >
                {cat} ({cantidadPorCategoria[cat] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* 🔹 GRID DE CURSOS */}
        <div
          className="cursos-grid animar-grid"
          key={categoriaActiva || "todas"}
        >
          {cursosFiltrados.map((curso) => (
            <div
              className="card course-card"
              key={curso._id}
              onClick={() => navigate(`/cursos/${curso._id}`)}
            >
              <div className="course-top">
                <img src={obtenerImagenCurso(curso)} alt={curso.titulo} />
              </div>

              <h3>{curso.titulo}</h3>
              <p>{curso.descripcion}</p>

              <span className="tag">{curso.categoria?.nombre}</span>

              <p className="course-price">${curso.precio?.toLocaleString()}</p>

              <div className="course-actions">
                <button
                  className="btn btn-secondary full-width"
                  onClick={(e) => handleVerCurso(e, curso._id)}
                >
                  Ver curso
                </button>

                <button
                  className="btn btn-primary full-width"
                  onClick={(e) => handleAgregarAlCarrito(e, curso)}
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cursos;
