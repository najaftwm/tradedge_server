const axios = require('axios');
const { getToken } = require('../utils/authToken');

const generatePaymentURL = async (req, res) => {
  try {
    const { amount, redirectUrl } = req.body;

    const amount = Number(amount) * 100 ;

    const merchantOrderId = `ORDER_${Date.now()}`;
    console.log('Merchant Order ID:', merchantOrderId);

    const phonepeRes = await axios.post(
      process.env.PHONEPE_PAYMENT_URL,
      {
        merchantOrderId,
        amount,
        paymentFlow: {
          type: 'PG_CHECKOUT',
          message: 'Payment message used for collect requests',
          merchantUrls: {
            redirectUrl: `${redirectUrl}/?merchantOrderId=${merchantOrderId}`,
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

    console.log('🔗 Redirect URL generated');
    const redirectLink = phonepeRes.data.redirectUrl;
    res.status(200).json({ merchantOrderId, redirectUrl: redirectLink });
  } catch (error) {
    console.error('🔥 PhonePe API Error:', error?.response?.data || error.message);
    res.status(500).json({
      error: 'Internal Server Error',
      details: error?.response?.data || error.message,
    });
  }
};

module.exports = { generatePaymentURL };
