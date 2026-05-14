import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";
import "./Blog.css";

function Blog() {
  const navigate = useNavigate();

  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");

  useEffect(() => {
    const cargarPublicaciones = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/api/publicaciones");
        const data = response.data;

        const publicacionesData = Array.isArray(data)
          ? data
          : data.publicaciones || data.datos || [];

        setPublicaciones(publicacionesData);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las publicaciones.");
      } finally {
        setLoading(false);
      }
    };

    cargarPublicaciones();
  }, []);

  const obtenerResumen = (pub) => {
    return pub.resumen || pub.contenido || "Sin resumen disponible.";
  };

  const obtenerCategoria = (pub) => {
    if (typeof pub.categoria === "string") return pub.categoria;
    return pub.categoria?.nombre || pub.tipo || "Institucional";
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const categorias = useMemo(() => {
    const categoriasUnicas = publicaciones
      .map((pub) => obtenerCategoria(pub))
      .filter(Boolean);

    return ["Todas", ...new Set(categoriasUnicas)];
  }, [publicaciones]);

  const publicacionesFiltradas = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLowerCase();

    return publicaciones.filter((pub) => {
      const categoria = obtenerCategoria(pub);

      const coincideCategoria =
        categoriaActiva === "Todas" ||
        categoria.toLowerCase() === categoriaActiva.toLowerCase();

      const coincideBusqueda =
        !textoBusqueda ||
        pub.titulo?.toLowerCase().includes(textoBusqueda) ||
        obtenerResumen(pub).toLowerCase().includes(textoBusqueda) ||
        categoria.toLowerCase().includes(textoBusqueda);

      return coincideCategoria && coincideBusqueda;
    });
  }, [publicaciones, busqueda, categoriaActiva]);

  if (loading) {
    return (
      <section className="blog-page">
        <div className="blog-container">
          <section className="blog-hero">
            <div>
              <span className="blog-eyebrow">BLOG Y NOVEDADES</span>
              <h1>
                Ideas y recursos para
                <span> seguir aprendiendo</span>
              </h1>
              <p>
                Artículos, novedades y recursos prácticos para desarrolladores,
                estudiantes y organizaciones.
              </p>
            </div>
          </section>

          <p className="blog-status">Cargando publicaciones...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="blog-page">
        <div className="blog-container">
          <section className="blog-hero">
            <div>
              <span className="blog-eyebrow">BLOG Y NOVEDADES</span>
              <h1>
                Ideas y recursos para
                <span> seguir aprendiendo</span>
              </h1>
              <p>
                Artículos, novedades y recursos prácticos para desarrolladores,
                estudiantes y organizaciones.
              </p>
            </div>
          </section>

          <p className="blog-status blog-error">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="blog-page">
      <div className="blog-container">
        <section className="blog-hero">
          <div className="blog-hero__text">
            <span className="blog-eyebrow">BLOG Y NOVEDADES</span>

            <h1>
              Ideas y recursos para
              <span> seguir aprendiendo</span>
            </h1>

            <p>
              Artículos, novedades y recursos prácticos para desarrolladores,
              estudiantes y organizaciones que quieren seguir creciendo.
            </p>
          </div>

          <div className="blog-search">
            <span>⌕</span>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar artículos..."
            />
          </div>
        </section>

        <div className="blog-filtros">
          {categorias.map((cat) => (
            <button
              key={cat}
              className={categoriaActiva === cat ? "activo" : ""}
              onClick={() => setCategoriaActiva(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {publicaciones.length === 0 ? (
          <p className="blog-status">No hay publicaciones disponibles.</p>
        ) : publicacionesFiltradas.length === 0 ? (
          <p className="blog-status">
            No se encontraron publicaciones con esos filtros.
          </p>
        ) : (
          <div className="blog-grid">
            {publicacionesFiltradas.map((pub, index) => {
              const categoria = obtenerCategoria(pub);
              const fecha =
                pub.fechaPublicacion || pub.createdAt || pub.updatedAt;

              return (
                <article className="blog-card" key={pub._id || index}>
                  <div className="blog-card__image">
                    <img src={getImageUrl(pub.imagen)} alt={pub.titulo} />
                  </div>

                  <div className="blog-card__body">
                    <div className="blog-card__meta">
                      <span>{categoria}</span>
                      <small>{formatearFecha(fecha)}</small>
                    </div>

                    <h2>{pub.titulo}</h2>

                    <p>{obtenerResumen(pub)}</p>

                    <button
                      className="blog-card__btn"
                      onClick={() => navigate(`/blog/${pub._id}`)}
                    >
                      Leer artículo →
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default Blog;
