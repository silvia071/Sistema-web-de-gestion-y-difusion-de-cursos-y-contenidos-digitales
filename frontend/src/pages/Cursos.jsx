import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/App.css";


import jsImg from "../assets/javaScript.png";
import pyImg from "../assets/Python.png";
import javaImg from "../assets/java.png";
import htmlImg from "../assets/html.png";
import cppImg from "../assets/C++.png";
import reactImg from "../assets/react.png"; 

const imagenes = {
  "JavaScript": jsImg,
  "Python": pyImg,
  "Java": javaImg,
  "HTML y CSS": htmlImg,
  "C++": cppImg,
  "React": reactImg
};

function Cursos() {
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const categoriaSeleccionada = decodeURIComponent(params.get("categoria") || "");

  const [categoriaActiva, setCategoriaActiva] = useState(categoriaSeleccionada || null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setCategoriaActiva(categoriaSeleccionada || null);
  }, [categoriaSeleccionada]);

  const categorias = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "HTML y CSS",
    "React"
 ];


  const cursos = [
    {
      id: 1,
      titulo: "JavaScript desde cero",
      descripcion: "Aprendé lógica, funciones, arrays y DOM.",
      nivel: "Inicial",
      categoria: "JavaScript",
      precio: 12000,
    },
    {
      id: 2,
      titulo: "Python para principiantes",
      descripcion: "Programación simple y poderosa desde cero.",
      nivel: "Inicial",
      categoria: "Python",
      precio: 13000,
    },
    {
      id: 3,
      titulo: "Java orientado a objetos",
      descripcion: "Clases, objetos, herencia y buenas prácticas.",
      nivel: "Intermedio",
      categoria: "Java",
      precio: 15000,
    },
    {
      id: 4,
      titulo: "C++ fundamentos",
      descripcion: "Memoria, punteros y programación eficiente.",
      nivel: "Intermedio",
      categoria: "C++",
      precio: 14000,
    },
    {
      id: 5,
      titulo: "HTML y CSS",
      descripcion: "Construí páginas web modernas y responsivas.",
      nivel: "Inicial",
      categoria: "HTML y CSS",
      precio: 11000,
    },
    {
      id: 6,
      titulo: "React básico",
      descripcion: "Componentes, props, estado y hooks.",
      nivel: "Intermedio",
      categoria: "React",
      precio: 16000,
    },
  ];

  const cursosFiltrados = categoriaActiva
    ? cursos.filter(
      (curso) =>
        curso.categoria.toLowerCase() === categoriaActiva.toLowerCase()
    )
    : cursos;

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2>Cursos</h2>
          <p>
            Explorá los cursos disponibles para aprender programación paso a
            paso.
          </p>
        </div>

        <div className="filtros">
          <span className="filtros-titulo">Categorías</span>
          <div className="dropdown">
            <button
              className="btn btn-primary"
              onClick={() => setOpen(prev => !prev)}
            >
              {categoriaActiva || "Todas"} ▼
            </button>

            {open && (
              <div className="dropdown-menu">
                <div onClick={() => {
                  setCategoriaActiva(null);
                  setOpen(false);
                }}>
                  Todas
                </div>

                {categorias.map((cat, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setCategoriaActiva(cat);
                      setOpen(false);
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="cursos-grid">
          {cursosFiltrados.map(curso => (
            <div
              className="card course-card"
              key={curso.id}
              onClick={() => navigate(`/cursos/${curso.id}`)}
            >
              <div className="course-top">
                <img
                  src={imagenes[curso.categoria]}
                  alt={curso.titulo}
                />
              </div>

              <h3>{curso.titulo}</h3>
              <p>{curso.descripcion}</p>

              <span className="tag">{curso.nivel}</span>

              <p className="course-price">${curso.precio.toLocaleString()}</p>

              <div className="course-actions">
                <button
                  className="btn btn-secondary full-width"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/cursos/${curso.id}`);
                  }}
                >
                  Ver curso
                </button>

                <button
                  className="btn btn-primary full-width"
                  onClick={(e) => {
                    e.stopPropagation();
                    agregarAlCarrito(curso);
                  }}
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
