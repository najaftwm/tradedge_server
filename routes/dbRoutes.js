const express = require('express');
const { addPaymentindb, userTransactionsById } = require('../controllers/dbController');

const router = express.Router();

router.post('/addPaymentindb', addPaymentindb);
router.get('/userTransactionsById', userTransactionsById);

module.exports = router;