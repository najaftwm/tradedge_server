const express = require('express');
const { getPaymentStatus } = require('../controllers/statusController');

const router = express.Router();

router.get('/paymentStatus', getPaymentStatus);

module.exports = router;