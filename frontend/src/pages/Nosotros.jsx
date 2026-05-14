import "./Nosotros.css";
import { Link } from "react-router-dom";

function Nosotros() {
  return (
    <section className="nosotros-page">
      <div className="nosotros-container">
        <div className="nosotros-hero">
          <span className="nosotros-badge">Conocé más sobre Mundo Dev</span>

          <h1 className="nosotros-title">
            Sobre <span>nosotros</span>
          </h1>

          <p className="nosotros-subtitle">
            Somos una plataforma enfocada en la formación en desarrollo y
            tecnología, creada para que aprender sea una experiencia clara,
            práctica y accesible.
          </p>
        </div>

        <div className="nosotros-grid">
          <article className="nosotros-card">
            <div className="nosotros-card__icon">🎯</div>
            <h3>Misión</h3>
            <p>
              Brindar educación accesible en programación y herramientas
              digitales, ayudando a las personas a desarrollar habilidades
              reales para crecer profesionalmente.
            </p>
          </article>

          <article className="nosotros-card">
            <div className="nosotros-card__icon">🚀</div>
            <h3>Visión</h3>
            <p>
              Convertirnos en una plataforma referente en formación tecnológica
              en habla hispana, impulsando el aprendizaje continuo y la
              innovación.
            </p>
          </article>

          <article className="nosotros-card">
            <div className="nosotros-card__icon">💡</div>
            <h3>Valores</h3>
            <p>
              Calidad, simplicidad, aprendizaje práctico, mejora continua y
              compromiso con el crecimiento de cada estudiante.
            </p>
          </article>
        </div>

        <div className="nosotros-stats">
          <div className="nosotros-stat">
            <span>👥</span>
            <strong>+15K</strong>
            <p>Estudiantes</p>
          </div>

          <div className="nosotros-stat">
            <span>🎓</span>
            <strong>+120</strong>
            <p>Cursos</p>
          </div>

          <div className="nosotros-stat">
            <span>⭐</span>
            <strong>4.8/5</strong>
            <p>Valoración promedio</p>
          </div>

          <div className="nosotros-stat">
            <span>🌎</span>
            <strong>20+</strong>
            <p>Países alcanzados</p>
          </div>
        </div>

        <div className="nosotros-cta">
          <h2>Aprender tecnología puede ser simple</h2>
          <p>
            En Mundo Dev buscamos acercar contenidos modernos, claros y útiles
            para que cada persona pueda avanzar a su ritmo y construir su camino
            profesional.
          </p>

          <Link to="/cursos" className="nosotros-cta__btn">
            Explorar cursos
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Nosotros;
