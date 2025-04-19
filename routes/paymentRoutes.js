const express = require('express');
const { generatePaymentURL } = require('../controllers/paymentController');

const router = express.Router();

router.post('/paymentURL', generatePaymentURL);

module.exports = router;