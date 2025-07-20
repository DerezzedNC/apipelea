const express = require('express');
const router = express.Router();
const { crearOBatallar, resumenBatallas } = require('../controllers/batallaController');

// Batallas 1vs1
router.post('/1vs1', crearOBatallar);
router.get('/', resumenBatallas);

module.exports = router;
