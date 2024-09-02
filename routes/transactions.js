// routes/transactions.js
const express = require('express');
const axios = require('axios');
const Transaction = require('../models/transactions');

const router = express.Router();

router.get('/:address', async (req, res) => {
  const { address } = req.params;

  try {
    // Fetch transactions from Etherscan API
    const response = await axios.get(`https://api.etherscan.io/api`, {
      params: {
        module: 'account',
        action: 'txlist',
        address,
        startblock: 0,
        endblock: 99999999,
        sort: 'asc',
        apiKey: process.env.ETHERSCAN_API_KEY,
      },
    });

    if (response.data.status !== '1') {
      return res.status(400).json({ error: 'Error fetching transactions' });
    }

    const transactions = response.data.result;

    // Save transactions to MongoDB
    await Transaction.insertMany(transactions);

    // Send response
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
