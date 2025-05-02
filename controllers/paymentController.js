const axios = require('axios');
const { getToken } = require('../utils/authToken');
const Payment = require('../model/paymentModel');

const generatePaymentURL = async (req, res) => {
  try {
    const { amount, redirectUrl, user_id, package_id, transaction_id, payment_date } = req.body;

    // Validate required fields
    if (!amount || !redirectUrl) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['amount', 'redirectUrl']
      });
    }

    // Generate merchant order ID
    const merchantOrderId = transaction_id || `TXN_${Date.now()}`;
    console.log('📝 Merchant Order ID:', merchantOrderId);

    // Calculate dates (optional fields)
    const paymentDate = payment_date ? new Date(payment_date) : new Date();
    const expiryDate = new Date(paymentDate);
    expiryDate.setMonth(expiryDate.getMonth() + 2);

    // Format dates for TWM
    const formattedPaymentDate = paymentDate.toISOString().slice(0, 19).replace('T', ' ');
    const formattedExpiryDate = expiryDate.toISOString().slice(0, 19).replace('T', ' ');

    // Generate PhonePe payment URL
    console.log('🔄 Generating PhonePe payment URL...');
    const phonepeRes = await axios.post(
      process.env.PHONEPE_PAYMENT_URL,
      {
        merchantOrderId,
        amount: amount * 100, // Amount in paise
        paymentFlow: {
          type: 'PG_CHECKOUT',
          message: 'Payment for package purchase',
          merchantUrls: {
            redirectUrl: `${redirectUrl}?transaction_id=${merchantOrderId}`,
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getToken(),
        },
      }
    );

    const redirectLink = phonepeRes.data.redirectUrl;
    console.log('🔗 Redirect URL generated');

    res.status(200).json({
      merchantOrderId,
      redirectUrl: redirectLink,
      amount: amount / 100,
      status: 'PENDING',
    });
  } catch (error) {
    console.error('🔥 Payment Error:', error);

    // Detailed error logging
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
        },
      });
    }

    // Return appropriate error response
    res.status(error.response?.status || 500).json({
      error: 'Payment initialization failed',
      details: error.response?.data || error.message,
      timestamp: new Date().toISOString(),
    });
  }
};

// Helper function to validate amount
const validateAmount = (amount) => {
  const numAmount = Number(amount);
  return !isNaN(numAmount) && numAmount > 0 && Number.isInteger(numAmount);
};

module.exports = { generatePaymentURL };

