const axios = require('axios');
const { getToken } = require('../utils/authToken');
const Payment = require('../model/paymentModel');

const getPaymentStatus = async (req, res) => {
  const { transaction_id } = req.query;

  if (!transaction_id) {
    return res.status(400).json({ error: 'transaction_id is required' });
  }

  try {
    const statusResponse = await axios.get(
      `${process.env.PHONEPE_PAYMENT_STATUS_URL}/order/${transaction_id}/status`,
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

  // try {
  //   const payment = await Payment.findOne({ merchantOrderId });
  //   if (!payment) {
  //     return res.status(404).json({ error: 'Payment not found' });
  //   }

  //   const paymentState = statusResponse.data.state;
  //   const paymentDetails = statusResponse.data.paymentDetails?.[0] || {};

  //   const updatedPayment = await Payment.findOneAndUpdate(
  //     { merchantOrderId },
  //     {
  //       status: paymentState,
  //       paymentMethod: paymentDetails.paymentMode,
  //       phonepeTransactionId: paymentDetails.transactionId,
  //     },
  //     { new: true }
  //   );
  //   console.log('✅ Payment updated:', updatedPayment);
  // } catch (dbError) {
  //   console.error('⚠️ Database update failed:', dbError);
  // }
  
};

module.exports = { getPaymentStatus };