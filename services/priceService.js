// services/priceService.js
const axios = require('axios');
const Price = require('../models/price');

async function fetchAndStoreEthPrice() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'ethereum',
        vs_currencies: 'inr',
      },
    });

    const ethPriceInInr = response.data.ethereum.inr;

    const newPrice = new Price({ price: ethPriceInInr });
    await newPrice.save();

    console.log(`Ethereum price of INR ${ethPriceInInr} stored in database.`);
  } catch (error) {
    console.error('Error fetching or storing Ethereum price:', error);
  }
}

module.exports = { fetchAndStoreEthPrice };
