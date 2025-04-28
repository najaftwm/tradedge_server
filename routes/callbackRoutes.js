const express = require('express');
const router = express.Router();
const { handlePhonePeCallback } = require('../controllers/callbackController.js'); // Add .js extension

router.post('/phonepe-callback', handlePhonePeCallback);

module.exports = router;