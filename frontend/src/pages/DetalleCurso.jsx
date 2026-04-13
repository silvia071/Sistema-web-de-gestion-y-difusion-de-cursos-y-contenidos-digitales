import { useNavigate, useParams } from "react-router-dom";

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

const cursos = {
  1: {
    titulo: "JavaScript desde cero",
    descripcion:
      "Aprendé lógica, funciones, arrays, objetos y manipulación del DOM para crear aplicaciones web dinámicas.",
    nivel: "Inicial",
    categoria: "JavaScript",
    lecciones: [
      "Introducción a JavaScript",
      "Variables y tipos de datos",
      "Condicionales y operadores",
      "Bucles y estructuras repetitivas",
      "Funciones y scope",
      "Arrays y objetos",
      "Manipulación del DOM",
      "Eventos y práctica final",
    ],
  },
  2: {
    titulo: "Python para principiantes",
    descripcion:
      "Empezá a programar con uno de los lenguajes más versátiles y amigables para quienes recién comienzan.",
    nivel: "Inicial",
    categoria: "Python",
    lecciones: [
      "Introducción a Python",
      "Variables y tipos de datos",
      "Condicionales",
      "Bucles for y while",
      "Funciones",
      "Listas, tuplas y diccionarios",
      "Manejo básico de archivos",
      "Ejercicio integrador",
    ],
  },
  3: {
    titulo: "Java orientado a objetos",
    descripcion:
      "Desarrollá una base sólida en programación orientada a objetos con clases, objetos, herencia y encapsulamiento.",
    nivel: "Intermedio",
    categoria: "Java",
    lecciones: [
      "Introducción a Java",
      "Variables, tipos y operadores",
      "Clases y objetos",
      "Métodos y atributos",
      "Encapsulamiento",
      "Herencia",
      "Polimorfismo",
      "Proyecto práctico",
    ],
  },
  4: {
    titulo: "C++ fundamentos",
    descripcion:
      "Comprendé la lógica del lenguaje, el uso de memoria y las bases para programar de manera eficiente.",
    nivel: "Intermedio",
    categoria: "C++",
    lecciones: [
      "Introducción a C++",
      "Variables y tipos",
      "Condicionales y bucles",
      "Funciones",
      "Arrays y punteros",
      "Referencias",
      "Memoria y estructura",
      "Ejercicio final",
    ],
  },
  5: {
    titulo: "HTML y CSS",
    descripcion:
      "Aprendé a construir interfaces web modernas, ordenadas y adaptables a diferentes pantallas.",
    nivel: "Inicial",
    categoria: "HTML y CSS",
    lecciones: [
      "Estructura básica de HTML",
      "Etiquetas principales",
      "Formularios y tablas",
      "Introducción a CSS",
      "Selectores y propiedades",
      "Box model",
      "Flexbox y Grid",
      "Maquetado final",
    ],
  },
  6: {
    titulo: "React básico",
    descripcion:
      "Descubrí cómo construir interfaces modernas mediante componentes reutilizables, props y hooks.",
    nivel: "Intermedio",
    categoria: "React",
    lecciones: [
      "Introducción a React",
      "JSX y componentes",
      "Props",
      "Estado con useState",
      "Eventos en React",
      "Renderizado condicional",
      "Listas y keys",
      "Mini proyecto final",
    ],
  },
};

function DetalleCurso() {
  const { id } = useParams();
  const navigate = useNavigate();

  const curso = cursos[id];

  if (!curso) {
    return (
      <div className="section">
        <div className="container">
          <div className="section-header">
            <h2>Curso no encontrado</h2>
            <p>El curso que intentás ver no existe o no está disponible.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="detalle-hero card">
          <img
            src={imagenes[curso.categoria]}
            alt={curso.titulo}
            className="detalle-img"
          />

          <span className="tag">{curso.nivel}</span>
          <h2>{curso.titulo}</h2>
          <p className="detalle-descripcion">{curso.descripcion}</p>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/cursos")}
          >
            Volver a cursos
          </button>
        </div>

        <div className="section-header detalle-header">
          <h2>Programa del curso</h2>
          <p>Estos son los contenidos principales que vas a recorrer.</p>
        </div>

        <div className="detalle-lecciones">
          {curso.lecciones.map((leccion, index) => (
            <div className="card leccion-card" key={index}>
              <div className="leccion-numero">{index + 1}</div>
              <div className="leccion-contenido">
                <h3>{leccion}</h3>
                <p>
                  En esta lección vas a trabajar los conceptos principales de{" "}
                  {leccion.toLowerCase()}.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DetalleCurso;
