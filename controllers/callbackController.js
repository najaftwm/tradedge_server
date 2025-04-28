const Payment = require('../model/paymentModel');

const handlePhonePeCallback = async (req, res) => {
  try {
    console.log('🔔 CALLBACK RECEIVED');
    console.log('Headers:', req.headers);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Query:', req.query);
    console.log('------------------------');

    // Send immediate response to PhonePe
    res.status(200).json({ 
      message: 'Callback received successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Callback Error:', error);
    res.status(200).json({ message: 'Processed with error' }); // Still return 200 to PhonePe
  }
};

module.exports = { handlePhonePeCallback };