// index.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron')
const transactionsRoute = require('./routes/transactions');
const expensesRoute = require('./routes/expenses'); 
const { fetchAndStoreEthPrice } = require('./services/priceService');

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api/transactions', transactionsRoute);
app.use('/api/expenses', expensesRoute);

// Immediately fetch and store Ethereum price at server start
(async () => {
  console.log('Fetching and storing Ethereum price at server start...');
  await fetchAndStoreEthPrice();
})();

// Schedule the cron job to run every 10 minutes
cron.schedule('*/10 * * * *', () => {
  console.log('Fetching and storing Ethereum price...');
  fetchAndStoreEthPrice();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
