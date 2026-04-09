<<<<<<< HEAD
//para hacer
=======
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";

function Cursos() {
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  const cursos = [
    {
      id: 1,
      titulo: "JavaScript desde cero",
      descripcion: "Aprendé lógica, funciones, arrays y DOM.",
      nivel: "Inicial",
      precio: 12000,
      imagen: "https://picsum.photos/300/200?1",
    },
    {
      id: 2,
      titulo: "Python para principiantes",
      descripcion: "Programación simple y poderosa desde cero.",
      nivel: "Inicial",
      precio: 13000,
      imagen: "https://picsum.photos/300/200?2",
    },
    {
      id: 3,
      titulo: "Java orientado a objetos",
      descripcion: "Clases, objetos, herencia y buenas prácticas.",
      nivel: "Intermedio",
      precio: 15000,
      imagen: "https://picsum.photos/300/200?3",
    },
    {
      id: 4,
      titulo: "C++ fundamentos",
      descripcion: "Memoria, punteros y programación eficiente.",
      nivel: "Intermedio",
      precio: 14000,
      imagen: "https://picsum.photos/300/200?4",
    },
    {
      id: 5,
      titulo: "HTML y CSS",
      descripcion: "Construí páginas web modernas y responsivas.",
      nivel: "Inicial",
      precio: 11000,
      imagen: "https://picsum.photos/300/200?5",
    },
    {
      id: 6,
      titulo: "React básico",
      descripcion: "Componentes, props, estado y hooks.",
      nivel: "Intermedio",
      precio: 16000,
      imagen: "https://picsum.photos/300/200?6",
    },
  ];

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

        <div className="cursos-grid">
          {cursos.map((curso) => (
            <div
              className="card course-card"
              key={curso.id}
              onClick={() => navigate(`/cursos/${curso.id}`)}
            >
              <div className="course-top"></div>

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
>>>>>>> bfaa1e832a1a16c2df45493aec008dc75fc1582c
