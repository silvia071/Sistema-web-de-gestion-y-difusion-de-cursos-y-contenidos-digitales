require("dotenv").config();
const mongoose = require("mongoose");
const AccesoCurso = require("../src/models/accesoCurso.model");

const generarCodigoCertificado = (accesoId) => {
  const base = String(accesoId).slice(-8).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `MD-${base}-${random}`;
};

const generarCertificadosPendientes = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("No se encontró MONGO_URI en el archivo .env");
    }

    await mongoose.connect(mongoUri);

    console.log("Conectado a MongoDB");

    const accesosPendientes = await AccesoCurso.find({
      progreso: 100,
      estado: "ACTIVO",
      $or: [
        { codigoCertificado: null },
        { codigoCertificado: { $exists: false } },
        { certificadoEmitido: false },
        { fechaFinalizacion: null },
      ],
    });

    console.log(`Accesos pendientes encontrados: ${accesosPendientes.length}`);

    for (const acceso of accesosPendientes) {
      acceso.certificadoEmitido = true;

      if (!acceso.fechaFinalizacion) {
        acceso.fechaFinalizacion = acceso.updatedAt || new Date();
      }

      if (!acceso.codigoCertificado) {
        acceso.codigoCertificado = generarCodigoCertificado(acceso._id);
      }

      await acceso.save();

      console.log(
        `Certificado generado para acceso ${acceso._id}: ${acceso.codigoCertificado}`,
      );
    }

    console.log("Proceso finalizado correctamente");
  } catch (error) {
    console.error("Error al generar certificados pendientes:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Desconectado de MongoDB");
  }
};

generarCertificadosPendientes();
