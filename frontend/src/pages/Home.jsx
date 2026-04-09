function Home() {
  const cursos = [
    {
      id: 1,
      titulo: "JavaScript desde cero",
      descripcion:
        "Aprendé variables, funciones, condicionales, DOM y lógica de programación web.",
      nivel: "Inicial",
    },
    {
      id: 2,
      titulo: "Python para principiantes",
      descripcion:
        "Empezá a programar con un lenguaje simple, potente y muy usado en múltiples áreas.",
      nivel: "Inicial",
    },
    {
      id: 3,
      titulo: "Java orientado a objetos",
      descripcion:
        "Desarrollá bases sólidas en clases, objetos, herencia y programación estructurada.",
      nivel: "Intermedio",
    },
  ];

  const categorias = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "HTML y CSS",
    "Bases de datos",
  ];

  const publicaciones = [
    {
      id: 1,
      titulo: "¿Con qué lenguaje conviene empezar a programar?",
      resumen:
        "Una guía simple para entender las diferencias entre JavaScript, Python y Java al comenzar.",
    },
    {
      id: 2,
      titulo: "Diferencias entre JavaScript, Java y Python",
      resumen:
        "Compará sintaxis, usos y ventajas de tres de los lenguajes más conocidos del desarrollo.",
    },
    {
      id: 3,
      titulo: "Buenas prácticas al aprender programación",
      resumen:
        "Consejos para avanzar mejor en lógica, resolución de problemas y organización del estudio.",
    },
  ];

  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <p className="hero-badge">
              Plataforma de cursos y contenidos digitales
            </p>
            <h2>Aprendé programación de forma clara y práctica</h2>
            <p className="hero-description">
              Explorá cursos, lenguajes y contenidos pensados para acompañarte
              paso a paso en tu aprendizaje.
            </p>

            <div className="hero-buttons">
              <button className="btn btn-primary">Ver cursos</button>
              <button className="btn btn-secondary">Ir al blog</button>
            </div>
          </div>

          <div className="hero-cards">
            <div className="tech-card">JavaScript</div>
            <div className="tech-card">Python</div>
            <div className="tech-card">Java</div>
            <div className="tech-card">C++</div>
          </div>
        </div>
      </section>

      <section className="benefits section">
        <div className="container grid-3">
          <div className="card">
            <h3>Cursos prácticos</h3>
            <p>
              Aprendé con contenido claro y orientado a ejercicios y proyectos
              reales.
            </p>
          </div>

          <div className="card">
            <h3>Lenguajes actuales</h3>
            <p>
              Accedé a contenidos sobre tecnologías y lenguajes ampliamente
              utilizados.
            </p>
          </div>

          <div className="card">
            <h3>Todo en un solo lugar</h3>
            <p>Cursos, blog y recursos digitales en una misma plataforma.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Cursos destacados</h2>
            <p>
              Elegí un lenguaje y empezá a desarrollar tu base en programación.
            </p>
          </div>

          <div className="grid-3">
            {cursos.map((curso) => (
              <div className="card course-card" key={curso.id}>
                <div className="course-top"></div>
                <h3>{curso.titulo}</h3>
                <p>{curso.descripcion}</p>
                <span className="tag">{curso.nivel}</span>
                <button className="btn btn-primary full-width">
                  Ver curso
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Categorías</h2>
            <p>Explorá los principales lenguajes y áreas de programación.</p>
          </div>

          <div className="categories-grid">
            {categorias.map((categoria, index) => (
              <div className="category-card" key={index}>
                {categoria}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Últimas publicaciones</h2>
            <p>
              Contenido útil para complementar tu aprendizaje en programación.
            </p>
          </div>

          <div className="grid-3">
            {publicaciones.map((post) => (
              <div className="card" key={post.id}>
                <h3>{post.titulo}</h3>
                <p>{post.resumen}</p>
                <button className="btn btn-secondary full-width">
                  Leer más
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta section">
        <div className="container cta-box">
          <h2>Sumate a Mundo Dev</h2>
          <p>
            Descubrí cursos y contenidos pensados para potenciar tu crecimiento
            en programación.
          </p>
          <button className="btn btn-primary">Crear cuenta</button>
        </div>
      </section>
    </>
  );
}

export default Home;
