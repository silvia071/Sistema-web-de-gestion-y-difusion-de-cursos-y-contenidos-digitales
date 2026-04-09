import { useNavigate } from "react-router-dom";

function Cursos() {
  const navigate = useNavigate();

  const cursos = [
    {
      id: 1,
      titulo: "JavaScript desde cero",
      descripcion: "Aprendé lógica, funciones, arrays y DOM.",
      nivel: "Inicial",
    },
    {
      id: 2,
      titulo: "Python para principiantes",
      descripcion: "Programación simple y poderosa desde cero.",
      nivel: "Inicial",
    },
    {
      id: 3,
      titulo: "Java orientado a objetos",
      descripcion: "Clases, objetos, herencia y buenas prácticas.",
      nivel: "Intermedio",
    },
    {
      id: 4,
      titulo: "C++ fundamentos",
      descripcion: "Memoria, punteros y programación eficiente.",
      nivel: "Intermedio",
    },
    {
      id: 5,
      titulo: "HTML y CSS",
      descripcion: "Construí páginas web modernas y responsivas.",
      nivel: "Inicial",
    },
    {
      id: 6,
      titulo: "React básico",
      descripcion: "Componentes, props, estado y hooks.",
      nivel: "Intermedio",
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

              <button
                className="btn btn-primary full-width"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/cursos/${curso.id}`);
                }}
              >
                Ver curso
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Cursos;
