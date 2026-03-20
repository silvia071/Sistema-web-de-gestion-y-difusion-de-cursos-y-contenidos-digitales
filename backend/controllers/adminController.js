const Administrador = require('../models/Administrador');

exports.crearAdmin = async (req, res) => {
    try {
        const admin = new Administrador(req.body);
        await admin.save();
        res.status(201).json(admin);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.gestionarUsuarios = async (req, res) => { [cite, 28]
    try {
        res.status(200).json({ mensaje: "Acceso a gestión de usuarios" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verEstadisticaVentas = async (req, res) => {
    try {
        res.status(200).json({ totalVentas: 0 });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
