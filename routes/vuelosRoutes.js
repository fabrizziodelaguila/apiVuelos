const express = require('express');
const router = express.Router();
const vuelosController = require('../controllers/vuelosControllers');

router.get('/', vuelosController.getAllVuelos);
router.post('/', vuelosController.createVuelo);

// graficos 
router.get('/filter-vuelos-estados', vuelosController.getVuelosByEstado);
router.get('/filter-vuelos-promedio', vuelosController.getPrecioPromedioPorDestino);
router.get('/filter-vuelos-fechas', vuelosController.getVuelosPorFecha);


module.exports = router;
