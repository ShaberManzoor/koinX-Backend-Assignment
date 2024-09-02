// routes/expenses.js
const express = require('express');
const Transaction = require('../models/transactions');
const Price = require('../models/price');

const router = express.Router();

router.get('/:address', async (req, res) => {
  const { address } = req.params;

  try {
    // Fetch all transactions for the provided address
    const transactions = await Transaction.find({ from: address });

    // Calculate total expenses
    let totalExpenses = 0;
    transactions.forEach(tx => {
      const gasUsed = parseFloat(tx.gasUsed);
      const gasPrice = parseFloat(tx.gasPrice);
      totalExpenses += (gasUsed * gasPrice) / 1e18; // Convert wei to ether
    });

    // Fetch the latest Ethereum price from the database
    const latestPriceDoc = await Price.findOne().sort({ timestamp: -1 });
    const ethPrice = latestPriceDoc ? latestPriceDoc.price : null;

    // Respond with the total expenses and current Ethereum price
    res.json({
      totalExpenses,
      ethPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
