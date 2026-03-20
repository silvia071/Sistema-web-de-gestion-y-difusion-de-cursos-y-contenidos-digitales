const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.post('/registro', adminController.crearAdmin);


router.get('/usuarios', adminController.gestionarUsuarios);
router.get('/estadisticas', adminController.verEstadisticaVentas);

module.exports = router;
