const express = require('express');
const router = express.Router();
const vuelosController = require('../controllers/vuelosControllers');

router.get('/', vuelosController.getAllVuelos);
router.post('/', vuelosController.createVuelo);

module.exports = router;
