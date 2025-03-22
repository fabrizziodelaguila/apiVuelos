const express = require('express');
const router = express.Router();
const {
    getAllDestinos,
    createDestino,
    searchDestinoByName,
    getDestinoById
} = require('../controllers/destinosController');

router.get('/', getAllDestinos);
router.post('/', createDestino);
router.get('/search', searchDestinoByName);
router.get('/:id', getDestinoById);

module.exports = router;
