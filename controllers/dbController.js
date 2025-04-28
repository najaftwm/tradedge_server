const axios = require('axios');

const addPaymentindb = async (req, res) => {
    try {
        console.log('🔔 UPDATE PAYMENT IN DB - Endpoint Hit');
        console.log('Received payload:', req.body);

        const { package_id, user_id, amount, payment_status, payment_date, transaction_id, payment_method } = req.body;

        // Validate required fields
        if (!transaction_id || !payment_status || !package_id || !user_id || !amount || !payment_date) {
            console.error('❌ Validation Error: Missing required fields');
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['transaction_id', 'payment_status', 'package_id', 'user_id', 'amount', 'payment_date']
            });
        }

        console.log('✅ Validation Passed');

        // Prepare the payload for the TWM API
        const dbPayload = {
            package_id: package_id,
            user_id: user_id,
            amount: amount, // Amount in INR (not converted to paise)
            payment_status: payment_status,
            payment_date: payment_date,
            transaction_id: transaction_id,
            payment_method: payment_method,
            orignal_amount: amount, // Original amount in INR
        };

        // Calculate expiry date (2 months from payment_date)
        console.log('📅 Calculating expiry date...');
        const expiryDate = new Date(payment_date);
        expiryDate.setMonth(expiryDate.getMonth() + 2);
        dbPayload.expiry_date = expiryDate.toISOString().slice(0, 19).replace('T', ' ');
        console.log('✅ Expiry date calculated:', dbPayload.expiry_date);

        console.log('📤 Adding payment record in DB:', dbPayload);

        // Send the payload to the TWM API
        console.log('📡 Sending payload to TWM API...');
        const dbResult = await axios.post(
            'https://gateway.twmresearchalert.com/payments',
            dbPayload,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "E2+Jz9+5Ba+R/DoWrvNaug==",
                },
            }
        );

        console.log('✅ Payment record added in DB:', dbResult.data);

        // Respond with success
        res.status(200).json({ message: 'Payment updated successfully', payment: dbResult.data });
    } catch (error) {
        console.error('❌ Database update failed:', error.message);

        // Log additional error details if available
        if (error.response) {
            console.error('Error Response Data:', error.response.data);
            console.error('Error Response Status:', error.response.status);
            console.error('Error Response Headers:', error.response.headers);
        } else {
            console.error('Error Details:', error);
        }

        res.status(500).json({ error: 'Failed to update payment', details: error.message });
    }
};

const userTransactionsById = async (req, res) => {
    try {
        console.log('🔔 USER TRANSACTIONS BY ID - Endpoint Hit');
        console.log('Received payload:', req.query);

        const { user_id } = req.query;

        // Validate required fields
        if (!user_id) {
            console.error('❌ Validation Error: Missing required fields');
            return res.status(400).json({
                error: 'Missing required fields',
                required: ['user_id']
            });
        }

        console.log('✅ Validation Passed');

        // Fetch user transactions from the TWM API
        console.log('📡 Fetching user transactions from TWM API...');
        const response = await axios.get(
            `https://gateway.twmresearchalert.com/payments?user_id=${user_id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "E2+Jz9+5Ba+R/DoWrvNaug==",
                },
            }
        );

        console.log('✅ User transactions fetched:', response.data);

        // Respond with success
        res.status(200).json({ message: 'User transactions fetched successfully', transactions: response.data });
    } catch (error) {
        console.error('❌ Fetching user transactions failed:', error.message);

        // Log additional error details if available
        if (error.response) {
            console.error('Error Response Data:', error.response.data);
            console.error('Error Response Status:', error.response.status);
            console.error('Error Response Headers:', error.response.headers);
        } else {
            console.error('Error Details:', error);
        }

        res.status(500).json({ error: 'Failed to fetch user transactions', details: error.message });
    }
}

module.exports = { addPaymentindb, userTransactionsById };