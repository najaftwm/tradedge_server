const axios = require('axios');
const { getToken } = require('../utils/authToken');

const getPaymentStatus = async (req, res) => {
  const { merchantOrderId } = req.query;

  if (!merchantOrderId) {
    return res.status(400).json({ error: 'merchantOrderId is required' });
  }

  try {
    const statusResponse = await axios.get(
      `${process.env.PHONEPE_PAYMENT_STATUS_URL}/order/${merchantOrderId}/status`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: getToken(),
        },
      }
    );

    console.log('🔍 Payment Status Response:', statusResponse.data);
    res.status(200).json({ status: statusResponse.data });
  } catch (error) {
    console.error('🔥 Full PhonePe status API Error:', error?.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch payment status',
      details: error?.response?.data || error.message,
    });
  }
};

module.exports = { getPaymentStatus };