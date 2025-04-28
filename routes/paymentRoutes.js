const express = require('express');
const { generatePaymentURL } = require('../controllers/paymentController');

const router = express.Router();

router.post('/paymentURL', generatePaymentURL);
// router.post('/updateStatus', updatePaymentStatus);

module.exports = router;