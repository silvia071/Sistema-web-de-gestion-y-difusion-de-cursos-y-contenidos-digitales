import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Award,
  CalendarDays,
  Copy,
  Download,
  Eye,
  FileText,
  GraduationCap,
  Search,
  ShieldCheck,
} from "lucide-react";
import api from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";
import { generarCertificado } from "../utils/generarCertificado";
import "./MisCertificados.css";

export default function MisCertificados() {
  const [accesos, setAccesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState("recientes");
  const [filtro, setFiltro] = useState("todos");

  const navigate = useNavigate();

  const obtenerMisCertificados = async () => {
    try {
      setLoading(true);
      setError("");

      const usuarioResponse = await api.get("/api/usuarios/me");
      const usuarioLogueado =
        usuarioResponse.data?.datos || usuarioResponse.data;

      const usuarioId = usuarioLogueado?._id || usuarioLogueado?.id;

      if (!usuarioId) {
        setError("No se encontró sesión activa");
        setAccesos([]);
        return;
      }

      const response = await api.get(`/api/accesos/usuario/${usuarioId}`);

      const accesosData = Array.isArray(response.data?.datos)
        ? response.data.datos
        : Array.isArray(response.data)
          ? response.data
          : [];

      const accesosActivos = accesosData.filter((acceso) => {
        const estadoActivo =
          !acceso?.estado || acceso.estado.toUpperCase() === "ACTIVO";

        return estadoActivo && acceso?.curso;
      });

      const accesosConCursoCompleto = await Promise.all(
        accesosActivos.map(async (acceso) => {
          if (typeof acceso.curso === "object") {
            return acceso;
          }

          const cursoResponse = await api.get(`/api/cursos/${acceso.curso}`);

          return {
            ...acceso,
            curso: cursoResponse.data?.datos || cursoResponse.data,
          };
        }),
      );

      const certificados = accesosConCursoCompleto.filter((acceso) => {
        return (
          Number(acceso?.progreso || 0) >= 100 &&
          acceso?.certificadoEmitido &&
          acceso?.codigoCertificado
        );
      });

      setAccesos(certificados);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.detalle ||
          error.response?.data?.mensaje ||
          error.response?.data?.error ||
          error.message ||
          "No se pudieron cargar tus certificados",
      );

      setAccesos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerMisCertificados();
  }, []);

  const obtenerImagenCurso = (curso) => {
    return (
      getImageUrl(curso?.imagenPortada) ||
      getImageUrl(curso?.imagen) ||
      "/placeholder-curso.png"
    );
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha registrada";

    return new Date(fecha).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const copiarCodigo = async (codigo) => {
    try {
      await navigator.clipboard.writeText(codigo);
    } catch (error) {
      console.error("No se pudo copiar el código", error);
    }
  };

  const ultimoCertificado = useMemo(() => {
    if (accesos.length === 0) return null;

    return [...accesos].sort(
      (a, b) =>
        new Date(b.fechaFinalizacion || b.updatedAt || 0) -
        new Date(a.fechaFinalizacion || a.updatedAt || 0),
    )[0];
  }, [accesos]);

  const progresoPromedio = useMemo(() => {
    if (accesos.length === 0) return 0;

    const total = accesos.reduce(
      (acumulado, acceso) => acumulado + Number(acceso?.progreso || 0),
      0,
    );

    return Math.round(total / accesos.length);
  }, [accesos]);

  const certificadosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    let resultado = accesos.filter((acceso) => {
      const titulo = acceso?.curso?.titulo?.toLowerCase() || "";
      const categoria = acceso?.curso?.categoria?.nombre?.toLowerCase() || "";
      const codigo = acceso?.codigoCertificado?.toLowerCase() || "";

      const coincideTexto =
        !texto ||
        titulo.includes(texto) ||
        categoria.includes(texto) ||
        codigo.includes(texto);

      const coincideFiltro =
        filtro === "todos" ||
        acceso?.curso?.categoria?.nombre?.toLowerCase() ===
          filtro.toLowerCase();

      return coincideTexto && coincideFiltro;
    });

    if (orden === "recientes") {
      resultado = [...resultado].sort(
        (a, b) =>
          new Date(b.fechaFinalizacion || b.updatedAt || 0) -
          new Date(a.fechaFinalizacion || a.updatedAt || 0),
      );
    }

    if (orden === "antiguos") {
      resultado = [...resultado].sort(
        (a, b) =>
          new Date(a.fechaFinalizacion || a.updatedAt || 0) -
          new Date(b.fechaFinalizacion || b.updatedAt || 0),
      );
    }

    if (orden === "nombre") {
      resultado = [...resultado].sort((a, b) =>
        (a.curso?.titulo || "").localeCompare(b.curso?.titulo || ""),
      );
    }

    return resultado;
  }, [accesos, busqueda, orden, filtro]);

  const categorias = useMemo(() => {
    const nombres = accesos
      .map((acceso) => acceso?.curso?.categoria?.nombre)
      .filter(Boolean);

    return [...new Set(nombres)];
  }, [accesos]);

  if (loading) {
    return (
      <main className="mis-certificados-page">
        <section className="mis-certificados-hero">
          <div>
            <span className="mis-certificados-eyebrow">
              PANEL DE ESTUDIANTE
            </span>
            <h1>Mis certificados</h1>
            <p>Cargando tus certificados...</p>
          </div>
        </section>

        <section className="mis-certificados-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mis-certificados-skeleton"></div>
          ))}
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mis-certificados-page">
        <section className="mis-certificados-hero">
          <div>
            <span className="mis-certificados-eyebrow">
              PANEL DE ESTUDIANTE
            </span>
            <h1>Mis certificados</h1>
            <p>Hubo un problema al cargar tus certificados.</p>
          </div>
        </section>

        <div className="mis-certificados-empty">
          <h3>No pudimos cargar tus certificados</h3>
          <p>{error}</p>
          <button onClick={() => navigate("/mis-cursos")}>
            Volver a mis cursos
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="mis-certificados-page">
      <section className="mis-certificados-hero">
        <div>
          <span className="mis-certificados-eyebrow">PANEL DE ESTUDIANTE</span>
          <h1>Mis certificados</h1>
          <p>
            Consultá, descargá y compartí todos los certificados que obtuviste
            al completar tus cursos.
          </p>
        </div>

        <div className="mis-certificados-hero-visual">
          <div className="certificado-ilustracion">
            <FileText />
            <div>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <Award />
          </div>
        </div>
      </section>

      <section className="mis-certificados-stats">
        <article className="cert-stat-card">
          <span className="cert-stat-icon purple">
            <Award />
          </span>
          <div>
            <strong>{accesos.length}</strong>
            <p>Certificados obtenidos</p>
            <small>¡Seguí aprendiendo!</small>
          </div>
        </article>

        <article className="cert-stat-card">
          <span className="cert-stat-icon blue">
            <GraduationCap />
          </span>
          <div>
            <strong>{accesos.length}</strong>
            <p>Cursos completados</p>
            <small>Formación finalizada</small>
          </div>
        </article>

        <article className="cert-stat-card">
          <span className="cert-stat-icon green">
            <CalendarDays />
          </span>
          <div>
            <small>Último emitido</small>
            <strong className="cert-stat-date">
              {ultimoCertificado
                ? formatearFecha(ultimoCertificado.fechaFinalizacion)
                : "-"}
            </strong>
            <p>{ultimoCertificado?.curso?.titulo || "Sin certificados"}</p>
          </div>
        </article>

        <article className="cert-stat-card">
          <span className="cert-stat-icon orange">
            <ShieldCheck />
          </span>
          <div>
            <strong>{progresoPromedio}%</strong>
            <p>de progreso promedio</p>
            <small>Excelente trabajo</small>
          </div>
        </article>
      </section>

      <section className="mis-certificados-toolbar">
        <div className="mis-certificados-search">
          <Search />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por curso o código..."
          />
        </div>

        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="mis-certificados-select"
        >
          <option value="todos">Todos</option>
          {categorias.map((categoria) => (
            <option key={categoria} value={categoria}>
              {categoria}
            </option>
          ))}
        </select>

        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value)}
          className="mis-certificados-select"
        >
          <option value="recientes">Más recientes</option>
          <option value="antiguos">Más antiguos</option>
          <option value="nombre">Nombre</option>
        </select>
      </section>

      {accesos.length === 0 ? (
        <section className="mis-certificados-empty">
          <h3>Todavía no tenés certificados</h3>
          <p>
            Completá un curso al 100% para obtener tu primer certificado de
            Mundo Dev.
          </p>
          <button onClick={() => navigate("/mis-cursos")}>
            Ir a mis cursos
          </button>
        </section>
      ) : certificadosFiltrados.length === 0 ? (
        <section className="mis-certificados-empty">
          <h3>No encontramos certificados</h3>
          <p>Probá con otra búsqueda o cambiá los filtros.</p>
        </section>
      ) : (
        <section className="mis-certificados-grid">
          {certificadosFiltrados.map((acceso) => {
            const curso = acceso.curso;

            return (
              <article key={acceso._id} className="certificado-card">
                <div className="certificado-card-img">
                  <img src={obtenerImagenCurso(curso)} alt={curso.titulo} />

                  <span className="certificado-badge">COMPLETADO</span>
                </div>

                <div className="certificado-card-body">
                  <h3>{curso.titulo}</h3>

                  <p className="certificado-fecha">
                    <CalendarDays />
                    Certificado emitido el{" "}
                    {formatearFecha(acceso.fechaFinalizacion)}
                  </p>

                  <div className="certificado-codigo-row">
                    <span>Código de certificado</span>

                    <button
                      type="button"
                      onClick={() => copiarCodigo(acceso.codigoCertificado)}
                      title="Copiar código"
                    >
                      {acceso.codigoCertificado}
                      <Copy />
                    </button>
                  </div>

                  <div className="certificado-actions">
                    <button
                      type="button"
                      className="btn-descargar-certificado"
                      onClick={() => generarCertificado(acceso)}
                    >
                      <Download />
                      Descargar certificado
                    </button>

                    <button
                      type="button"
                      className="btn-ver-curso-certificado"
                      onClick={() => navigate(`/curso/${curso._id}/aprender`)}
                    >
                      <Eye />
                      Ver curso
                    </button>
                  </div>

                  <div className="certificado-card-footer">
                    <span>
                      <ShieldCheck />
                      Verificado por Mundo Dev
                    </span>

                    <span>
                      <FileText />
                      PDF
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      <section className="mis-certificados-info">
        <div>
          <span>
            <ShieldCheck />
          </span>

          <div>
            <h3>
              Todos tus certificados son generados y verificados por Mundo Dev.
            </h3>
            <p>Cada certificado cuenta con un código único de validación.</p>
          </div>
        </div>

        <div>
          <span>
            <FileText />
          </span>

          <div>
            <h3>Documento descargable en PDF</h3>
            <p>Listo para compartir e imprimir.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
