const express = require('express');
const router = express.Router();
const {
    getAllDestinos,
    createDestino,
    searchDestinoByName
} = require('../controllers/destinosController');

router.get('/', getAllDestinos);
router.post('/', createDestino);
router.get('/search', searchDestinoByName);

module.exports = router;
