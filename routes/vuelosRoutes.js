const express = require('express');
const router = express.Router();
const vuelosController = require('../controllers/vuelosControllers');

router.get('/vuelos', vuelosController.getAllVuelos);
router.post('/vuelos', vuelosController.createVuelo);

module.exports = router;
