const Usuario = require("../models/usuario.model");
const Curso = require("../models/curso.model");
const Leccion = require("../models/leccion.model");
const Pago = require("../models/pago.model");
const Compra = require("../models/compra.model");
const DetalleCompra = require("../models/detalleCompra.model");
const AccesoCurso = require("../models/accesoCurso.model");

const ESTADOS_COMPRA_APROBADA = [
  "PAGADA",
  "APROBADA",
  "COMPLETADA",
  "FINALIZADA",
];

const obtenerFechaDesdePeriodo = (periodo) => {
  const ahora = new Date();
  const desde = new Date();

  if (periodo === "hoy") {
    desde.setHours(0, 0, 0, 0);
    return desde;
  }

  if (periodo === "7dias") {
    desde.setDate(ahora.getDate() - 7);
    return desde;
  }

  if (periodo === "mes") {
    desde.setDate(1);
    desde.setHours(0, 0, 0, 0);
    return desde;
  }

  desde.setDate(ahora.getDate() - 30);
  return desde;
};

const crearFiltroFecha = (periodo) => {
  const desde = obtenerFechaDesdePeriodo(periodo);

  return {
    createdAt: {
      $gte: desde,
    },
  };
};

const formatearTiempoRelativo = (fecha) => {
  if (!fecha) return "Fecha no disponible";

  const ahora = new Date();
  const fechaEvento = new Date(fecha);
  const diferenciaMs = ahora - fechaEvento;

  const minutos = Math.floor(diferenciaMs / 60000);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (minutos < 1) return "Recién";
  if (minutos < 60) return `Hace ${minutos} minuto${minutos === 1 ? "" : "s"}`;
  if (horas < 24) return `Hace ${horas} hora${horas === 1 ? "" : "s"}`;
  return `Hace ${dias} día${dias === 1 ? "" : "s"}`;
};

const obtenerActividadReciente = async () => {
  const [usuarios, compras, pagos, cursos, lecciones] = await Promise.all([
    Usuario.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .select("nombre apellido email createdAt"),

    Compra.find({})
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("usuario", "nombre apellido email")
      .select("usuario total estado createdAt"),

    Pago.find({ estado: "PENDIENTE" })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("monto estado createdAt"),

    Curso.find({})
      .sort({ updatedAt: -1 })
      .limit(2)
      .select("titulo estado updatedAt createdAt"),

    Leccion.find({})
      .sort({ updatedAt: -1 })
      .limit(2)
      .select("titulo estado updatedAt createdAt"),
  ]);

  const actividades = [];

  usuarios.forEach((usuario) => {
    const nombre =
      `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim() ||
      usuario.email ||
      "Usuario";

    actividades.push({
      tipo: "usuario",
      titulo: "Nuevo usuario registrado",
      descripcion: nombre,
      fecha: usuario.createdAt,
      color: "violet",
    });
  });

  compras.forEach((compra) => {
    const usuario =
      `${compra.usuario?.nombre || ""} ${compra.usuario?.apellido || ""}`.trim() ||
      compra.usuario?.email ||
      "Usuario";

    actividades.push({
      tipo: "compra",
      titulo: "Nueva compra registrada",
      descripcion: `${usuario} · $ ${Number(compra.total || 0).toLocaleString(
        "es-AR",
      )}`,
      fecha: compra.createdAt,
      color: "blue",
    });
  });

  pagos.forEach((pago) => {
    actividades.push({
      tipo: "pago",
      titulo: "Pago pendiente de revisión",
      descripcion: `$ ${Number(pago.monto || 0).toLocaleString("es-AR")}`,
      fecha: pago.createdAt,
      color: "orange",
    });
  });

  cursos.forEach((curso) => {
    actividades.push({
      tipo: "curso",
      titulo: "Curso actualizado",
      descripcion: curso.titulo || "Curso sin título",
      fecha: curso.updatedAt || curso.createdAt,
      color: "cyan",
    });
  });

  lecciones.forEach((leccion) => {
    actividades.push({
      tipo: "leccion",
      titulo: "Lección actualizada",
      descripcion: leccion.titulo || "Lección sin título",
      fecha: leccion.updatedAt || leccion.createdAt,
      color: "green",
    });
  });

  return actividades
    .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))
    .slice(0, 6)
    .map((actividad) => ({
      ...actividad,
      tiempo: formatearTiempoRelativo(actividad.fecha),
    }));
};

const obtenerResumenAdmin = async (periodo = "30dias") => {
  const filtroFecha = crearFiltroFecha(periodo);

  const [
    totalUsuarios,
    totalCursos,
    leccionesPublicadas,
    pagosPendientes,
    totalCompras,
    compras,
    detallesCompra,
    accesosActivos,
    actividadReciente,
  ] = await Promise.all([
    Usuario.countDocuments(filtroFecha),

    Curso.countDocuments({
      estado: "PUBLICADO",
      ...filtroFecha,
    }),

    Leccion.countDocuments({
      estado: "PUBLICADO",
      ...filtroFecha,
    }),

    Pago.countDocuments({
      estado: "PENDIENTE",
      ...filtroFecha,
    }),

    Compra.countDocuments(filtroFecha),

    Compra.find(filtroFecha).select("total estado"),

    DetalleCompra.countDocuments(filtroFecha),

    AccesoCurso.countDocuments({
      estado: "ACTIVO",
      ...filtroFecha,
    }),

    obtenerActividadReciente(),
  ]);

  const totalVendido = compras.reduce((total, compra) => {
    const estado = String(compra.estado || "").toUpperCase();

    if (!ESTADOS_COMPRA_APROBADA.includes(estado)) {
      return total;
    }

    return total + Number(compra.total || 0);
  }, 0);

  return {
    periodo,
    totalUsuarios,
    totalCursos,
    pagosPendientes,
    leccionesPublicadas,
    totalCompras,
    totalVendido,
    cursosVendidos: detallesCompra,
    accesosActivos,
    actividadReciente,
    ultimaActualizacion: new Date(),
  };
};

module.exports = {
  obtenerResumenAdmin,
};
