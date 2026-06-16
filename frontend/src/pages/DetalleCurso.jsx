import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import api from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";
import "./DetalleCurso.css";

function tokenValido(token) {
  return (
    token && token !== "null" && token !== "undefined" && token.trim() !== ""
  );
}

function obtenerNombreUsuario(usuario) {
  const nombreCompleto = `${usuario?.nombre || ""} ${
    usuario?.apellido || ""
  }`.trim();

  return nombreCompleto || usuario?.email || "Alumno";
}

function DetalleCurso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { agregarAlCarrito, mensajeCarrito } = useCarrito();

  const [curso, setCurso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [yaComprado, setYaComprado] = useState(false);

  const [esFavorito, setEsFavorito] = useState(false);
  const [favoritoCargando, setFavoritoCargando] = useState(false);
  const [mensajeFavorito, setMensajeFavorito] = useState("");

  const [resenias, setResenias] = useState([]);
  const [resumenResenias, setResumenResenias] = useState({
    promedio: 0,
    cantidad: 0,
  });
  const [miResenia, setMiResenia] = useState(null);
  const [puntaje, setPuntaje] = useState(5);
  const [comentario, setComentario] = useState("");
  const [reseniaCargando, setReseniaCargando] = useState(false);
  const [mensajeResenia, setMensajeResenia] = useState("");

  const token = localStorage.getItem("token");
  const haySesion = tokenValido(token);

  const rol = localStorage.getItem("rol");
  const esAdmin = rol === "ADMINISTRADOR";

  const cargarResenias = useCallback(async () => {
    try {
      const response = await api.get(`/api/resenias/curso/${id}`);

      const lista = Array.isArray(response.data?.resenias)
        ? response.data.resenias
        : [];

      setResenias(lista);
      setResumenResenias({
        promedio: Number(response.data?.resumen?.promedio || 0),
        cantidad: Number(response.data?.resumen?.cantidad || 0),
      });
    } catch (error) {
      console.error("Error al cargar reseñas:", error);
      setResenias([]);
      setResumenResenias({
        promedio: 0,
        cantidad: 0,
      });
    }
  }, [id]);

  const cargarMiResenia = useCallback(async () => {
    try {
      if (!haySesion || esAdmin) {
        setMiResenia(null);
        return;
      }

      const response = await api.get(`/api/resenias/curso/${id}/mi-resenia`);
      const resenia = response.data?.resenia || null;

      setMiResenia(resenia);

      if (resenia) {
        setPuntaje(Number(resenia.puntaje || 5));
        setComentario(resenia.comentario || "");
      }
    } catch (error) {
      console.error("Error al cargar mi reseña:", error);
      setMiResenia(null);
    }
  }, [id, haySesion, esAdmin]);

  useEffect(() => {
    const cargarCurso = async () => {
      try {
        setLoading(true);
        setError("");

        const endpoint = esAdmin
          ? `/api/cursos/admin/${id}`
          : `/api/cursos/${id}`;

        const response = await api.get(endpoint);
        setCurso(response.data.datos);
      } catch (err) {
        console.error(err);
        setError("Error al cargar el curso");
      } finally {
        setLoading(false);
      }
    };

    cargarCurso();
  }, [id, esAdmin]);

  useEffect(() => {
    const verificarCompra = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!haySesion || !userId || esAdmin) return;

        const response = await api.get(`/api/accesos/usuario/${userId}`);
        const accesos = response.data.datos || [];

        const tieneCurso = accesos.some((acceso) => {
          const cursoAccesoId =
            acceso?.curso?._id || acceso?.curso?.id || acceso?.curso;

          return String(cursoAccesoId) === String(id);
        });

        setYaComprado(tieneCurso);
      } catch (err) {
        console.error("Error al verificar acceso al curso:", err);
        setYaComprado(false);
      }
    };

    verificarCompra();
  }, [id, haySesion, esAdmin]);

  useEffect(() => {
    const verificarFavorito = async () => {
      try {
        if (!haySesion) {
          setEsFavorito(false);
          return;
        }

        const response = await api.get("/api/favoritos/ids");

        const ids = Array.isArray(response.data?.cursosFavoritosIds)
          ? response.data.cursosFavoritosIds
          : [];

        setEsFavorito(
          ids.map((cursoId) => String(cursoId)).includes(String(id)),
        );
      } catch (error) {
        console.error("Error al verificar favorito:", error);
        setEsFavorito(false);
      }
    };

    verificarFavorito();
  }, [id, haySesion]);

  useEffect(() => {
    cargarResenias();
  }, [cargarResenias]);

  useEffect(() => {
    cargarMiResenia();
  }, [cargarMiResenia]);

  const precioFormateado = useMemo(() => {
    if (!curso?.precio) return "$0";
    return `$${curso.precio.toLocaleString("es-AR")}`;
  }, [curso]);

  const promedioFormateado = useMemo(() => {
    const promedio = Number(resumenResenias.promedio || 0);

    if (promedio <= 0) return "Sin reseñas";

    return promedio.toFixed(1);
  }, [resumenResenias.promedio]);

  const obtenerImagenCurso = (cursoActual) => {
    return (
      getImageUrl(cursoActual?.imagenPortada) ||
      getImageUrl(cursoActual?.imagen) ||
      "/placeholder-curso.png"
    );
  };

  const mostrarMensajeFavorito = (texto) => {
    setMensajeFavorito(texto);

    setTimeout(() => {
      setMensajeFavorito("");
    }, 2500);
  };

  const mostrarMensajeResenia = (texto) => {
    setMensajeResenia(texto);

    setTimeout(() => {
      setMensajeResenia("");
    }, 3000);
  };

  const handleToggleFavorito = async () => {
    if (!haySesion) {
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    if (favoritoCargando) return;

    try {
      setFavoritoCargando(true);

      const response = await api.patch(`/api/favoritos/${id}/toggle`);

      const nuevoEstado = Boolean(response.data?.esFavorito);
      const mensaje =
        response.data?.mensaje ||
        (nuevoEstado
          ? "Curso agregado a favoritos"
          : "Curso quitado de favoritos");

      setEsFavorito(nuevoEstado);
      mostrarMensajeFavorito(mensaje);
    } catch (error) {
      console.error("Error al actualizar favorito:", error);

      mostrarMensajeFavorito(
        error.response?.data?.mensaje || "No se pudo actualizar el favorito",
      );
    } finally {
      setFavoritoCargando(false);
    }
  };

  const handleEntrarAlCurso = () => {
    if (!haySesion) {
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    navigate(`/curso/${curso._id}/aprender`);
  };

  const handleAgregarAlCarrito = async () => {
    if (!haySesion) {
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    if (esAdmin) {
      handleEntrarAlCurso();
      return;
    }

    await agregarAlCarrito({
      ...curso,
      imagen: obtenerImagenCurso(curso),
    });
  };

  const handleGuardarResenia = async (event) => {
    event.preventDefault();

    if (!haySesion) {
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    if (!yaComprado && !esAdmin) {
      mostrarMensajeResenia(
        "Solo podés reseñar cursos a los que tenés acceso.",
      );
      return;
    }

    if (String(comentario).trim().length < 5) {
      mostrarMensajeResenia("El comentario debe tener al menos 5 caracteres.");
      return;
    }

    try {
      setReseniaCargando(true);

      if (miResenia?._id) {
        await api.patch(`/api/resenias/${miResenia._id}`, {
          puntaje: Number(puntaje),
          comentario: comentario.trim(),
        });

        mostrarMensajeResenia("Reseña actualizada correctamente.");
      } else {
        await api.post("/api/resenias", {
          cursoId: id,
          puntaje: Number(puntaje),
          comentario: comentario.trim(),
        });

        mostrarMensajeResenia("Reseña publicada correctamente.");
      }

      await cargarResenias();
      await cargarMiResenia();
    } catch (error) {
      console.error("Error al guardar reseña:", error);

      mostrarMensajeResenia(
        error.response?.data?.mensaje || "No se pudo guardar la reseña.",
      );
    } finally {
      setReseniaCargando(false);
    }
  };

  const handleEliminarResenia = async () => {
    if (!miResenia?._id) return;

    try {
      setReseniaCargando(true);

      await api.delete(`/api/resenias/${miResenia._id}`);

      setMiResenia(null);
      setPuntaje(5);
      setComentario("");

      await cargarResenias();

      mostrarMensajeResenia("Reseña eliminada correctamente.");
    } catch (error) {
      console.error("Error al eliminar reseña:", error);

      mostrarMensajeResenia(
        error.response?.data?.mensaje || "No se pudo eliminar la reseña.",
      );
    } finally {
      setReseniaCargando(false);
    }
  };

  if (loading) return <p className="detalle-curso-estado">Cargando...</p>;
  if (error) return <p className="detalle-curso-estado">{error}</p>;
  if (!curso) return <p className="detalle-curso-estado">No encontrado</p>;

  const puedeEntrarAlCurso = yaComprado || esAdmin;

  const puedeReseniar = haySesion && yaComprado && !esAdmin;

  return (
    <section className="detalle-curso-page">
      <div className="detalle-curso-top">
        <button className="btn-volver-cta" onClick={() => navigate("/cursos")}>
          ← Volver a cursos
        </button>
      </div>

      <div className="detalle-curso-hero">
        <div className="detalle-curso-imagen">
          <img src={obtenerImagenCurso(curso)} alt={curso.titulo} />
        </div>

        <div className="detalle-curso-info">
          <div className="detalle-curso-header-line">
            <span className="detalle-curso-categoria">
              {curso.categoria?.nombre || "Curso"}
            </span>
          </div>

          <h1>{curso.titulo}</h1>

          <p className="detalle-curso-descripcion">{curso.descripcion}</p>

          {mensajeFavorito && (
            <p className="detalle-curso-mensaje-favorito">{mensajeFavorito}</p>
          )}

          <div className="detalle-curso-meta">
            <span>📘 Nivel: {curso.nivel}</span>
            <span>⏱ Duración: {curso.duracion}</span>
            <span>
              ⭐ {promedioFormateado}
              {resumenResenias.cantidad > 0
                ? ` (${resumenResenias.cantidad})`
                : ""}
            </span>
          </div>

          {!puedeEntrarAlCurso && (
            <p className="detalle-curso-precio">{precioFormateado}</p>
          )}

          <div className="detalle-curso-acciones">
            <div className="detalle-curso-acciones-principales">
              {puedeEntrarAlCurso ? (
                <button
                  className="detalle-curso-btn"
                  onClick={handleEntrarAlCurso}
                >
                  ▶ Comenzar curso
                </button>
              ) : (
                <button
                  className="detalle-curso-btn"
                  onClick={handleAgregarAlCarrito}
                >
                  🛒 Agregar al carrito
                </button>
              )}

              {!esAdmin && (
                <button
                  type="button"
                  className={`detalle-curso-favorito ${
                    esFavorito ? "detalle-curso-favorito--activo" : ""
                  }`}
                  onClick={handleToggleFavorito}
                  disabled={favoritoCargando}
                  title={
                    esFavorito ? "Quitar de favoritos" : "Guardar en favoritos"
                  }
                  aria-label={
                    esFavorito ? "Quitar de favoritos" : "Guardar en favoritos"
                  }
                >
                  <span>{esFavorito ? "♥" : "♡"}</span>
                  {esFavorito ? "Guardado" : "Guardar"}
                </button>
              )}
            </div>

            {mensajeCarrito && (
              <p className="detalle-curso-mensaje-carrito">{mensajeCarrito}</p>
            )}
          </div>
        </div>

        <div className="detalle-curso-beneficios">
          <div className="beneficio-item">
            <span className="beneficio-icono">♾</span>
            <div>
              <h3>Acceso de por vida</h3>
              <p>Aprendé a tu ritmo, cuando quieras</p>
            </div>
          </div>

          <div className="beneficio-item">
            <span className="beneficio-icono">🏅</span>
            <div>
              <h3>Certificado incluido</h3>
              <p>Al completar el curso</p>
            </div>
          </div>

          <div className="beneficio-item">
            <span className="beneficio-icono">💬</span>
            <div>
              <h3>Soporte del instructor</h3>
              <p>Respondemos tus dudas</p>
            </div>
          </div>

          <div className="beneficio-item">
            <span className="beneficio-icono">📦</span>
            <div>
              <h3>Recursos descargables</h3>
              <p>Material complementario</p>
            </div>
          </div>
        </div>
      </div>

      <div className="detalle-curso-extra">
        <div className="detalle-curso-bloque">
          <div className="bloque-header">
            <span className="bloque-icono">🎯</span>
            <h2>Qué vas a aprender</h2>
          </div>

          {curso.aprendizajes?.length > 0 ? (
            <ul className="detalle-curso-lista">
              {curso.aprendizajes.map((item, i) => (
                <li key={i}>
                  <span>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="detalle-curso-vacio">
              Próximamente vas a tener los objetivos del curso.
            </p>
          )}
        </div>

        <div className="detalle-curso-bloque">
          <div className="bloque-header lecciones-header">
            <div>
              <span className="bloque-icono">▶</span>
              <h2>Lecciones incluidas</h2>
            </div>

            <span className="lecciones-total">
              {resumenResenias.cantidad}{" "}
              {resumenResenias.cantidad === 1 ? "reseña" : "reseñas"}
            </span>
          </div>

          <div className="lecciones-lista">
            {curso.lecciones?.map((l, i) => (
              <div
                key={l._id}
                className={`leccion-item ${
                  !puedeEntrarAlCurso ? "leccion-bloqueada" : ""
                }`}
                onClick={() => {
                  if (!puedeEntrarAlCurso) return;

                  navigate(`/curso/${curso._id}/aprender?leccion=${l._id}`);
                }}
              >
                <div className="leccion-numero">{i + 1}</div>

                <div className="leccion-info">
                  <span className="leccion-titulo">{l.titulo}</span>
                  <span className="leccion-duracion">
                    ⏱ {l.duracionMinutos} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="detalle-curso-resenias">
        <div className="detalle-curso-bloque detalle-curso-resenias-form">
          <div className="bloque-header lecciones-header">
            <div>
              <span className="bloque-icono">⭐</span>
              <h2>Tu reseña</h2>
            </div>

            {miResenia && <span className="lecciones-total">Ya publicada</span>}
          </div>

          {!haySesion ? (
            <p className="detalle-curso-vacio">
              Iniciá sesión para dejar una reseña si tenés acceso al curso.
            </p>
          ) : !puedeReseniar ? (
            <p className="detalle-curso-vacio">
              Solo los alumnos con acceso al curso pueden dejar una reseña.
            </p>
          ) : (
            <form className="resenia-form" onSubmit={handleGuardarResenia}>
              <div className="resenia-estrellas">
                {[1, 2, 3, 4, 5].map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    className={valor <= puntaje ? "activa" : ""}
                    onClick={() => setPuntaje(valor)}
                    aria-label={`${valor} estrellas`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Contá brevemente qué te pareció el curso..."
                maxLength={500}
              />

              <div className="resenia-form-acciones">
                <button type="submit" disabled={reseniaCargando}>
                  {miResenia ? "Actualizar reseña" : "Publicar reseña"}
                </button>

                {miResenia && (
                  <button
                    type="button"
                    className="ghost"
                    onClick={handleEliminarResenia}
                    disabled={reseniaCargando}
                  >
                    Eliminar
                  </button>
                )}
              </div>

              {mensajeResenia && (
                <p className="detalle-curso-mensaje-favorito">
                  {mensajeResenia}
                </p>
              )}
            </form>
          )}
        </div>

        <div className="detalle-curso-bloque detalle-curso-resenias-lista">
          <div className="bloque-header lecciones-header">
            <div>
              <span className="bloque-icono">💬</span>
              <h2>Reseñas del curso</h2>
            </div>

            <span className="lecciones-total">
              {resumenResenias.cantidad} reseñas
            </span>
          </div>

          {resenias.length === 0 ? (
            <p className="detalle-curso-vacio">
              Todavía no hay reseñas para este curso.
            </p>
          ) : (
            <div className="resenias-lista">
              {resenias.map((resenia) => (
                <article className="resenia-card" key={resenia._id}>
                  <div className="resenia-card-header">
                    <div>
                      <strong>{obtenerNombreUsuario(resenia.usuario)}</strong>
                      <span>
                        {new Date(resenia.fechaCreacion).toLocaleDateString(
                          "es-AR",
                        )}
                      </span>
                    </div>

                    <div className="resenia-card-estrellas">
                      {"★".repeat(Number(resenia.puntaje || 0))}
                      {"☆".repeat(5 - Number(resenia.puntaje || 0))}
                    </div>
                  </div>

                  <p>{resenia.comentario}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="detalle-curso-stats">
        <div className="stat-item">
          <span className="stat-icono">👥</span>
          <div>
            <strong>+3.200</strong>
            <p>Estudiantes</p>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-icono">⭐</span>
          <div>
            <strong>{promedioFormateado}</strong>
            <p>Calificación promedio</p>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-icono">📊</span>
          <div>
            <strong>+12</strong>
            <p>Horas de contenido</p>
          </div>
        </div>

        <div className="stat-item">
          <span className="stat-icono">{"</>"}</span>
          <div>
            <strong>Proyectos prácticos</strong>
            <p>Incluidos</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DetalleCurso;
