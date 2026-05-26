import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";
import "./Home.css";

import reactHero from "../assets/react-hero.png";
import figmaHero from "../assets/figma-hero.png";
import marketingHero from "../assets/marketing-hero.png";

function tokenValido(token) {
  return (
    token && token !== "null" && token !== "undefined" && token.trim() !== ""
  );
}

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoritosIds, setFavoritosIds] = useState([]);
  const [favoritoProcesandoId, setFavoritoProcesandoId] = useState(null);
  const [cursoAvisoId, setCursoAvisoId] = useState(null);
  const [cursoAvisoTexto, setCursoAvisoTexto] = useState("");

  const cargarFavoritos = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      if (!tokenValido(token)) {
        setFavoritosIds([]);
        return;
      }

      const response = await api.get("/api/favoritos/ids");

      const ids = Array.isArray(response.data?.cursosFavoritosIds)
        ? response.data.cursosFavoritosIds
        : [];

      setFavoritosIds(ids.map((id) => String(id)));
    } catch (error) {
      console.error("Error al obtener favoritos:", error);
      setFavoritosIds([]);
    }
  }, []);

  const mostrarAvisoCurso = (cursoId, texto) => {
    setCursoAvisoId(cursoId);
    setCursoAvisoTexto(texto);

    setTimeout(() => {
      setCursoAvisoId(null);
      setCursoAvisoTexto("");
    }, 2500);
  };

  const handleToggleFavorito = async (e, cursoId) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");

    if (!tokenValido(token)) {
      navigate("/login", {
        state: { from: location.pathname },
      });

      return;
    }

    if (favoritoProcesandoId === cursoId) return;

    try {
      setFavoritoProcesandoId(cursoId);

      const response = await api.patch(`/api/favoritos/${cursoId}/toggle`);

      const esFavorito = Boolean(response.data?.esFavorito);
      const mensaje =
        response.data?.mensaje ||
        (esFavorito
          ? "Curso agregado a favoritos"
          : "Curso quitado de favoritos");

      setFavoritosIds((prev) => {
        const yaExiste = prev.includes(cursoId);

        if (esFavorito && !yaExiste) {
          return [...prev, cursoId];
        }

        if (!esFavorito) {
          return prev.filter((id) => id !== cursoId);
        }

        return prev;
      });

      mostrarAvisoCurso(cursoId, mensaje);
    } catch (error) {
      console.error("Error al actualizar favorito:", error);

      mostrarAvisoCurso(
        cursoId,
        error.response?.data?.mensaje || "No se pudo actualizar el favorito",
      );
    } finally {
      setFavoritoProcesandoId(null);
    }
  };

  useEffect(() => {
    const obtenerCursos = async () => {
      try {
        const response = await api.get("/api/cursos");
        const lista = response.data.datos || [];

        setCursos(lista.slice(0, 4));
      } catch (error) {
        console.error("Error cargando cursos:", error);
        setCursos([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerCursos();
  }, []);

  useEffect(() => {
    cargarFavoritos();
  }, [cargarFavoritos]);

  const obtenerCategoriaTexto = (curso) => {
    return typeof curso.categoria === "object"
      ? curso.categoria?.nombre || "CURSO"
      : curso.categoria || "CURSO";
  };

  const obtenerCategoriaClase = (categoriaTexto) => {
    const texto = categoriaTexto.toLowerCase();

    if (texto.includes("marketing")) return "course-card--marketing";
    if (texto.includes("dise")) return "course-card--design";
    if (texto.includes("backend")) return "course-card--backend";
    if (texto.includes("python")) return "course-card--backend";
    if (texto.includes("java")) return "course-card--backend";

    return "course-card--dev";
  };

  const obtenerIniciales = (curso, categoriaTexto) => {
    const titulo = (curso.titulo || "").toLowerCase();

    if (titulo.includes("javascript")) return "JS";
    if (titulo.includes("python")) return "PY";
    if (titulo.includes("java")) return "JV";
    if (titulo.includes("c++")) return "C++";
    if (titulo.includes("react")) return "⚛";
    if (categoriaTexto.toLowerCase().includes("marketing")) return "MK";
    if (categoriaTexto.toLowerCase().includes("dise")) return "UI";

    return categoriaTexto.slice(0, 2).toUpperCase();
  };

  const construirImagenCurso = (curso) => {
    const imagen =
      curso?.imagenPortada ||
      curso?.imagen ||
      curso?.imagenUrl ||
      curso?.urlImagen ||
      curso?.image ||
      curso?.img;

    if (!imagen || typeof imagen !== "string") return null;

    const limpia = imagen.trim();
    if (!limpia) return null;

    return getImageUrl(limpia);
  };

  const primerCurso = cursos[0];
  const imagenPreview = primerCurso ? construirImagenCurso(primerCurso) : null;

  return (
    <main className="home-page">
      <section className="hero-home">
        <div className="hero-home__content">
          <div className="hero-home__left">
            <span className="hero-home__eyebrow">
              PLATAFORMA DE CURSOS ONLINE
            </span>

            <h1 className="hero-home__title">
              Aprendé hoy.
              <br />
              <span>Transformá tu futuro.</span>
            </h1>

            <p className="hero-home__text">
              Accedé a cursos digitales diseñados para ayudarte a desarrollar
              nuevas habilidades, avanzar profesionalmente y aprender a tu
              ritmo.
            </p>

            <div className="hero-home__actions">
              <Link
                to="/cursos"
                className="hero-home__btn hero-home__btn--primary"
              >
                Ver cursos
              </Link>

              <a
                href="#como-funciona"
                className="hero-home__btn hero-home__btn--secondary"
              >
                ¿Cómo funciona?
              </a>
            </div>

            <div className="hero-home__stats">
              <div className="hero-home__stat">
                <strong>+100</strong>
                <span>Cursos</span>
              </div>

              <div className="hero-home__stat">
                <strong>+5.000</strong>
                <span>Estudiantes</span>
              </div>

              <div className="hero-home__stat">
                <strong>4.9/5</strong>
                <span>Valoración</span>
              </div>
            </div>
          </div>

          <div className="hero-home__right" aria-hidden="true">
            <div className="hero-home__visual">
              <div className="hero-card">
                <span className="hero-card__badge">DESARROLLO WEB</span>

                <div className="hero-card__content">
                  <div className="hero-card__left">
                    <h3>
                      React
                      <br />
                      Completo
                    </h3>

                    <p>
                      Aprendé a crear interfaces modernas, dinámicas y
                      escalables con herramientas actuales.
                    </p>

                    <Link to="/cursos" className="hero-card__btn">
                      Explorar
                    </Link>
                  </div>

                  <div className="hero-card__right">
                    <div className="hero-card__code hero-card__code--left"></div>
                    <img src={reactHero} alt="" />
                    <div className="hero-card__code hero-card__code--right"></div>
                  </div>
                </div>
              </div>

              <div className="hero-course-card hero-course-card--top">
                <span className="hero-course-card__tag hero-course-card__tag--pink">
                  DISEÑO
                </span>

                <div className="hero-course-card__small-content">
                  <div className="hero-course-card__small-text">
                    <h4>UI/UX</h4>
                    <h4>Diseño Web</h4>
                  </div>

                  <div className="hero-course-card__small-media">
                    <img src={figmaHero} alt="" />
                  </div>
                </div>
              </div>

              <div className="hero-course-card hero-course-card--bottom">
                <span className="hero-course-card__tag hero-course-card__tag--green">
                  MARKETING
                </span>

                <div className="hero-course-card__small-content">
                  <div className="hero-course-card__small-text">
                    <h4>Marketing</h4>
                    <h4>Digital</h4>
                  </div>

                  <div className="hero-course-card__small-media">
                    <img src={marketingHero} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits-strip">
        <div className="benefits-strip__grid">
          <article className="benefit-item">
            <div className="benefit-item__icon">📘</div>

            <div className="benefit-item__content">
              <h3>Aprendé a tu ritmo</h3>
              <p>Accedé cuando quieras desde cualquier dispositivo.</p>
            </div>
          </article>

          <article className="benefit-item">
            <div className="benefit-item__icon">📄</div>

            <div className="benefit-item__content">
              <h3>Certificados</h3>
              <p>Sumá valor a tu perfil al completar tus cursos.</p>
            </div>
          </article>

          <article className="benefit-item">
            <div className="benefit-item__icon">∞</div>

            <div className="benefit-item__content">
              <h3>Acceso ilimitado</h3>
              <p>Revisá el contenido todas las veces que necesites.</p>
            </div>
          </article>

          <article className="benefit-item">
            <div className="benefit-item__icon">🎧</div>

            <div className="benefit-item__content">
              <h3>Soporte</h3>
              <p>Acompañamiento para resolver dudas durante el aprendizaje.</p>
            </div>
          </article>
        </div>
      </section>

      <section className="featured-courses">
        <div className="container">
          <div className="featured-courses__header">
            <div>
              <span className="section-eyebrow">CURSOS DESTACADOS</span>
              <h2>Cursos destacados.</h2>
              <p>Una selección de contenidos para empezar hoy.</p>
            </div>

            <Link to="/cursos" className="featured-courses__btn">
              Ver todos →
            </Link>
          </div>

          {loading ? (
            <p className="home-loading">Cargando cursos...</p>
          ) : cursos.length === 0 ? (
            <p className="home-loading">No hay cursos disponibles.</p>
          ) : (
            <div className="featured-courses__grid">
              {cursos.map((curso) => {
                const cursoId = String(curso._id || curso.id);
                const categoriaTexto = obtenerCategoriaTexto(curso);
                const categoriaClase = obtenerCategoriaClase(categoriaTexto);
                const iniciales = obtenerIniciales(curso, categoriaTexto);
                const imagenCurso = construirImagenCurso(curso);
                const esFavorito = favoritosIds.includes(cursoId);

                return (
                  <article
                    className={`course-card ${categoriaClase}`}
                    key={cursoId}
                  >
                    <div className="course-card__cover">
                      <span className="course-card__badge">
                        {categoriaTexto}
                      </span>

                      <button
                        type="button"
                        className={`course-card__favorite ${
                          esFavorito ? "course-card__favorite--active" : ""
                        }`}
                        onClick={(e) => handleToggleFavorito(e, cursoId)}
                        disabled={favoritoProcesandoId === cursoId}
                        aria-label={
                          esFavorito
                            ? "Quitar de favoritos"
                            : "Agregar a favoritos"
                        }
                        title={
                          esFavorito
                            ? "Quitar de favoritos"
                            : "Agregar a favoritos"
                        }
                      >
                        {esFavorito ? "♥" : "♡"}
                      </button>

                      {imagenCurso && (
                        <img
                          src={imagenCurso}
                          alt={curso.titulo}
                          className="course-card__cover-image"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";

                            const fallback =
                              e.currentTarget.parentElement?.querySelector(
                                ".course-card__cover-fallback",
                              );

                            if (fallback) {
                              fallback.classList.remove("is-hidden");
                            }
                          }}
                        />
                      )}

                      <div
                        className={`course-card__cover-fallback ${
                          imagenCurso ? "is-hidden" : ""
                        }`}
                      >
                        <div className="course-card__cover-glow"></div>
                        <div className="course-card__cover-icon">
                          {iniciales}
                        </div>
                      </div>
                    </div>

                    <div className="course-card__content">
                      <h3>{curso.titulo}</h3>

                      <div className="course-card__footer">
                        {(curso.profesor || curso.instructor) && (
                          <span className="course-card__teacher">
                            {curso.profesor || curso.instructor}
                          </span>
                        )}

                        <span className="course-card__rating">
                          ⭐{" "}
                          {curso.promedioResenias ||
                            curso.rating ||
                            curso.promedio ||
                            4.9}
                        </span>
                      </div>

                      <div className="course-card__price">
                        ${Number(curso.precio || 0).toLocaleString("es-AR")}
                      </div>

                      <Link
                        to={`/cursos/${cursoId}`}
                        className="course-card__link"
                      >
                        Ver curso
                      </Link>
                    </div>

                    {cursoAvisoId === cursoId && (
                      <div className="course-card__notice">
                        {cursoAvisoTexto}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="how-home" id="como-funciona">
        <div className="how-home__container">
          <span className="section-eyebrow">CÓMO FUNCIONA</span>

          <div className="how-home__header">
            <h2>Aprender es fácil.</h2>
            <p>Elegí un curso, accedé al contenido y avanzá a tu ritmo.</p>
          </div>

          <div className="how-home__steps">
            <article className="how-step">
              <span className="how-step__number">1</span>

              <div className="how-step__icon">🛒</div>

              <div>
                <h3>Elegí tu curso</h3>
                <p>
                  Explorá nuestra biblioteca y elegí el contenido ideal para
                  vos.
                </p>
              </div>
            </article>

            <article className="how-step">
              <span className="how-step__number">2</span>

              <div className="how-step__icon">▶</div>

              <div>
                <h3>Accedé al contenido</h3>
                <p>
                  Disfrutá lecciones claras, recursos y ejercicios prácticos.
                </p>
              </div>
            </article>

            <article className="how-step">
              <span className="how-step__number">3</span>

              <div className="how-step__icon">🚀</div>

              <div>
                <h3>Aprendé a tu ritmo</h3>
                <p>
                  Avanzá cuando quieras y aplicá lo aprendido en proyectos
                  reales.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="mobile-preview">
        <div className="mobile-preview__intro">
          <span className="section-eyebrow">APRENDÉ DESDE CUALQUIER LUGAR</span>

          <h2>
            Tu plataforma,
            <br />
            siempre con vos.
          </h2>

          <p>
            Accedé a tus cursos desde cualquier dispositivo. Sin límites, sin
            horarios y con una experiencia pensada para aprender mejor.
          </p>

          <div className="mobile-preview__features">
            <span>✓ 100% responsive</span>
            <span>✓ Contenido siempre disponible</span>
            <span>✓ Experiencia simple y moderna</span>
          </div>
        </div>

        <div className="mobile-preview__grid">
          <div className="phone-mockup phone-mockup--small">
            <div className="phone-mockup__top">
              <span className="phone-logo">{"{MD}"}</span>
              <span>☰</span>
            </div>

            <span className="phone-eyebrow">PLATAFORMA DE CURSOS</span>

            <h3>
              Aprendé hoy.
              <span>Transformá tu futuro.</span>
            </h3>

            <p>Accedé a los mejores cursos online y desarrollá habilidades.</p>

            <button>Ver cursos</button>

            <div className="phone-stats">
              <span>+100</span>
              <span>+5.000</span>
              <span>4.9/5</span>
            </div>
          </div>

          <div className="phone-mockup phone-mockup--main">
            <div className="phone-mockup__top">
              <span>‹</span>
              <span>☰</span>
            </div>

            <h4>Cursos destacados</h4>

            <div className="phone-course">
              {imagenPreview && (
                <img
                  src={imagenPreview}
                  alt={primerCurso?.titulo || "Curso destacado"}
                />
              )}

              <strong>{primerCurso?.titulo || "Curso de JavaScript"}</strong>
              <span>⭐ 4.9</span>
              <b>
                ${Number(primerCurso?.precio || 15000).toLocaleString("es-AR")}
              </b>
              <button>Ver curso</button>
            </div>
          </div>

          <div className="phone-mockup phone-mockup--small">
            <div className="phone-mockup__top">
              <span>‹</span>
              <span>☰</span>
            </div>

            <span className="phone-badge">DESARROLLO WEB</span>

            <h4>React Completo</h4>

            <p>Aprendé React desde cero y construí aplicaciones modernas.</p>

            <button>Ver curso</button>

            <div className="phone-mini-card">DISEÑO · UI/UX Diseño Web</div>
            <div className="phone-mini-card">MARKETING · Marketing Digital</div>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta__content">
          <div className="home-cta__icon">🎓</div>

          <div>
            <h2>¿Listo para comenzar?</h2>
            <p>Unite a miles de estudiantes y empezá a aprender hoy mismo.</p>
          </div>

          <Link to="/cursos" className="home-cta__btn">
            Explorar cursos →
          </Link>
        </div>
      </section>
    </main>
  );
}
