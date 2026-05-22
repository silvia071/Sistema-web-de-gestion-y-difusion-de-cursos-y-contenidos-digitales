const adminService = require("../services/admin.service");

const obtenerResumenAdmin = async (req, res) => {
  try {
    const { periodo = "30dias" } = req.query;

    const resumen = await adminService.obtenerResumenAdmin(periodo);

    return res.status(200).json({
      mensaje: "Resumen del panel administrador obtenido correctamente",
      datos: resumen,
    });
  } catch (error) {
    return res.status(500).json({
      mensaje: "Error al obtener el resumen del panel administrador",
      error: error.message,
    });
  }
};

module.exports = {
  obtenerResumenAdmin,
};
